import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { In, Repository } from 'typeorm';
import { Receta } from './entities/receta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaInsumo } from '../receta-insumo/entities/receta-insumo.entity';
import { Insumo } from '../insumos/entities/insumo.entity';
import { RecetaSubreceta } from '../receta-subreceta/entities/receta-subreceta.entity';

@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(Receta)
    private readonly recetasRepository: Repository<Receta>,
    @InjectRepository(Insumo)
    private readonly insumosRepository: Repository<Insumo>,
  ) {}

  async create(createRecetaDto: CreateRecetaDto): Promise<Receta> {
    const receta = this.recetasRepository.create({
      nombre: createRecetaDto.nombre,
      descripcion: createRecetaDto.descripcion,
      unidad_medida: createRecetaDto.unidad_medida,
      unidades_por_receta: createRecetaDto.unidades_por_receta,
    });

    let costo_total = 0;

    if (createRecetaDto.insumos && createRecetaDto.insumos.length > 0) {
      const insumosIds = createRecetaDto.insumos.map((item) => item.insumo);

      const insumosFromRepo = await this.insumosRepository.find({
        where: { id: In(insumosIds) },
      });

      if (insumosFromRepo.length !== insumosIds.length) {
        throw new BadRequestException(
          'Uno o más insumos proporcionados no existen en la base de datos.',
        );
      }

      // Creates  all the RecetaInsumos middle entities
      receta.insumos = createRecetaDto.insumos.map((item) => {
        const relacion = new RecetaInsumo();

        const insumo = insumosFromRepo.find((i) => i.id === item.insumo);
        if (insumo === undefined) {
          throw new BadRequestException(
            'Uno o más insumos proporcionados no existen en la base de datos.',
          );
        }

        relacion.insumo = insumo;
        relacion.cantidad = item.cantidad;

        const cantidadItem = parseFloat(item.cantidad);
        const precioInsumo = parseFloat(insumo.costo_unidad_medida);

        costo_total += precioInsumo * cantidadItem;

        return relacion;
      });
    }

    if (createRecetaDto.subrecetas && createRecetaDto.subrecetas.length > 0) {
      const subrecetasIds = createRecetaDto.subrecetas.map(
        (item) => item.subreceta,
      );

      const recetasFromRepo = await this.recetasRepository.find({
        where: { id: In(subrecetasIds) },
      });

      if (recetasFromRepo.length !== subrecetasIds.length) {
        throw new BadRequestException(
          'Una o más recetas proporcionadas no existen en la base de datos.',
        );
      }

      // Creates  all the RecetasSubrecetas middle entities
      receta.subrecetas = createRecetaDto.subrecetas.map((item) => {
        const relacion = new RecetaSubreceta();

        const subreceta = recetasFromRepo.find((r) => r.id === item.subreceta);
        if (subreceta === undefined) {
          throw new BadRequestException(
            'Una o más recetas proporcionadas no existen en la base de datos.',
          );
        }

        relacion.subreceta = subreceta;
        relacion.cantidad = item.cantidad;

        const cantidadItem = parseFloat(item.cantidad);
        const precioInsumo = parseFloat(subreceta.costo_unidad);
        costo_total += precioInsumo * cantidadItem;

        return relacion;
      });
    }

    receta.costo_total = costo_total.toString();
    const unidades = parseFloat(receta.unidades_por_receta);
    // Prevents division by zero
    receta.costo_unidad =
      unidades > 0 ? (costo_total / unidades).toString() : '0';
    return await this.recetasRepository.save(receta);
  }

  async findAll() {
    return await this.recetasRepository.find({
      relations: [
        'insumos',
        'insumos.insumo',
        'subrecetas',
        'subrecetas.receta',
      ],
    });
  }

  async findOne(id: string) {
    const receta = await this.recetasRepository.findOne({
      where: { id },
      relations: [
        'insumos',
        'insumos.insumo',
        'subrecetas',
        'subrecetas.receta',
      ],
    });
    if (!receta) {
      throw new NotFoundException(`Receta con id ${id} no encontrada.`);
    }
    return receta;
  }

  async findOneByName(name: string) {
    const receta = await this.recetasRepository.findOne({
      where: { nombre: name },
      relations: [
        'insumos',
        'insumos.insumo',
        'subrecetas',
        'subrecetas.receta',
      ],
    });
    if (!receta) {
      throw new NotFoundException(`Receta con nombre ${name} no encontrada.`);
    }
    return receta;
  }

  async update(id: string, updateRecetaDto: UpdateRecetaDto) {
    const receta = await this.findOne(id);

    Object.assign(receta, {
      nombre: updateRecetaDto.nombre ?? receta.nombre,
      descripcion: updateRecetaDto.descripcion ?? receta.descripcion,
      unidad_medida: updateRecetaDto.unidad_medida ?? receta.unidad_medida,
      unidades_por_receta:
        updateRecetaDto.unidades_por_receta ?? receta.unidades_por_receta,
    });

    let costo_total = parseFloat(receta.costo_total);

    if (updateRecetaDto.insumos && updateRecetaDto.insumos.length > 0) {
      const insumosIds = updateRecetaDto.insumos.map((item) => item.insumo);
      const insumosFromRepo = await this.insumosRepository.find({
        where: { id: In(insumosIds) },
      });

      if (insumosIds.length === insumosFromRepo.length) {
        throw new BadRequestException(
          `${Math.abs(insumosIds.length - insumosFromRepo.length)} de los insumos proporcionados no existen`,
        );
      }

      costo_total = 0;
      receta.insumos.map((item) => {
        const relacion = new RecetaInsumo();

        //Checks if the "receta insumo"  already exists
        const relacionExistente = receta.insumos.find(
          (ri) => ri.insumo.id === item.insumo.id,
        );
        //If it exists, uses the same ID so TypeORM doesn't create a new entity on the database
        if (relacionExistente) {
          relacion.id = relacionExistente.id;
        }

        const insumo = insumosFromRepo.find((i) => i.id === item.insumo.id);
        if (insumo === undefined) {
          throw new BadRequestException(
            'Uno o más insumos proporcionados no existen en la base de datos.',
          );
        }
        relacion.insumo = insumo;
        relacion.cantidad = item.cantidad;

        const cantidadItem = parseFloat(item.cantidad);
        const precioInsumo = parseFloat(insumo.costo_unidad_medida);

        costo_total += precioInsumo * cantidadItem;
        return relacion;
      });
    }

    if (updateRecetaDto.subrecetas && updateRecetaDto.subrecetas.length > 0) {
      const subrecetasIds = updateRecetaDto.subrecetas.map(
        (item) => item.subreceta,
      );
      const recetasFromRepo = await this.recetasRepository.find({
        where: { id: In(subrecetasIds) },
      });

      if (subrecetasIds.length === recetasFromRepo.length) {
        throw new BadRequestException(
          `${Math.abs(subrecetasIds.length - recetasFromRepo.length)} de las subrecetas proporcionadas no existen`,
        );
      }

      costo_total = 0;
      receta.insumos.map((item) => {
        const relacion = new RecetaSubreceta();

        //Checks if the "receta subreceta"  already exists
        const relacionExistente = receta.subrecetas.find(
          (rs) => rs.subreceta.id === item.receta.id,
        );
        //If it exists, uses the same ID so TypeORM doesn't create a new entity on the database
        if (relacionExistente) {
          relacion.id = relacionExistente.id;
        }

        const subreceta = recetasFromRepo.find((i) => i.id === item.receta.id);
        if (subreceta === undefined) {
          throw new BadRequestException(
            'Una o más subrecetas proporcionadas no existen en la base de datos.',
          );
        }
        relacion.subreceta = subreceta;
        relacion.cantidad = item.cantidad;

        const cantidadItem = parseFloat(item.cantidad);
        const precioInsumo = parseFloat(receta.costo_unidad);

        costo_total += precioInsumo * cantidadItem;
        return relacion;
      });
    }

    receta.costo_total = costo_total.toString();
    const unidades = parseFloat(receta.unidades_por_receta);
    // Prevents division by zero
    receta.costo_unidad =
      unidades > 0 ? (costo_total / unidades).toString() : '0';
    return await this.recetasRepository.save(receta);
  }

  async deleteCascade(id: string) {
    const receta = await this.findOne(id);
    await this.recetasRepository.remove(receta);
  }

  async softDeleteCascade(id: string) {
    const receta = await this.findOne(id);
    await this.recetasRepository.softRemove(receta);
  }

  async restore(id: string) {
    const receta = await this.recetasRepository.findOne({
      where: { id },
      relations: [
        'insumos',
        'insumos.insumo',
        'subrecetas',
        'subrecetas.receta',
      ],
      withDeleted: true,
    });
    if (!receta) {
      throw new NotFoundException(`Receta con id ${id} no encontrada.`);
    }
    await this.recetasRepository.recover(receta);
  }
}
