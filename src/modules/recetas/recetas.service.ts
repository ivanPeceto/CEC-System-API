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
    if (!createRecetaDto.insumos && !createRecetaDto.subrecetas) {
      throw new BadRequestException(
        'Se debe proporcionar al menos un insumo o una subreceta.',
      );
    }
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
        'subrecetas.subreceta',
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
        'subrecetas.subreceta',
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
        'subrecetas.subreceta',
      ],
    });
    if (!receta) {
      throw new NotFoundException(`Receta con nombre ${name} no encontrada.`);
    }
    return receta;
  }

  async update(id: string, updateRecetaDto: UpdateRecetaDto) {
    // First checks for "insumos" and "subrecetas" array not being empy at the same time
    if (
      updateRecetaDto.insumos &&
      updateRecetaDto.subrecetas &&
      updateRecetaDto.insumos.length === 0 &&
      updateRecetaDto.subrecetas.length === 0
    ) {
      throw new BadRequestException(
        'Toda receta debe tener al menos un insumo o subreceta asociado.',
      );
    }
    const receta = await this.findOne(id);

    Object.assign(receta, {
      nombre: updateRecetaDto.nombre ?? receta.nombre,
      descripcion: updateRecetaDto.descripcion ?? receta.descripcion,
      unidad_medida: updateRecetaDto.unidad_medida ?? receta.unidad_medida,
      unidades_por_receta:
        updateRecetaDto.unidades_por_receta ?? receta.unidades_por_receta,
    });

    // Insumos array logic
    if (updateRecetaDto.insumos) {
      if (updateRecetaDto.insumos.length === 0) {
        receta.insumos = [];
      } else {
        // Extract all the insumos id's from the dto to check if they exist in the db
        const insumosIds = updateRecetaDto.insumos.map((item) => item.insumo);
        const insumosFromRepo = await this.insumosRepository.find({
          where: { id: In(insumosIds) },
        });

        if (insumosIds.length !== insumosFromRepo.length) {
          throw new BadRequestException(
            `${Math.abs(insumosIds.length - insumosFromRepo.length)} de los insumos proporcionados no existen`,
          );
        }

        //Updates insumos array
        receta.insumos = updateRecetaDto.insumos.map((i) => {
          const relacion = new RecetaInsumo();

          //Checks if the middle entity "Receta Insumos" already exists
          const relacionExistente = receta.insumos.find(
            (ri) => ri.insumo.id === i.insumo,
          );
          if (relacionExistente) {
            relacion.id = relacionExistente.id;
          }

          const insumo = insumosFromRepo.find((ins) => ins.id === i.insumo);
          if (insumo === undefined) {
            throw new BadRequestException(
              'Uno o más insumos proporcionados no existen en la base de datos.',
            );
          }
          relacion.insumo = insumo;
          relacion.cantidad = i.cantidad;

          return relacion;
        });
      }
    }

    // Subrecetas array logic
    if (updateRecetaDto.subrecetas) {
      if (updateRecetaDto.subrecetas.length === 0) {
        receta.subrecetas = [];
      } else {
        // Extract all the subrecetas id's from the dto to check if they exist in the db
        const subrecetasIds = updateRecetaDto.subrecetas.map(
          (item) => item.subreceta,
        );
        const recetasFromRepo = await this.recetasRepository.find({
          where: { id: In(subrecetasIds) },
        });

        if (subrecetasIds.length !== recetasFromRepo.length) {
          throw new BadRequestException(
            `${Math.abs(subrecetasIds.length - recetasFromRepo.length)} de la recetas proporcionadas no existen`,
          );
        }

        //Updates subrecetas array
        receta.subrecetas = updateRecetaDto.subrecetas.map((i) => {
          const relacion = new RecetaSubreceta();

          //Checks if the middle entity "Receta Subrecetas" already exists
          const relacionExistente = receta.subrecetas.find(
            (rs) => rs.subreceta.id === i.subreceta,
          );
          if (relacionExistente) {
            relacion.id = relacionExistente.id;
          }

          const subreceta = recetasFromRepo.find(
            (subr) => subr.id === i.subreceta,
          );
          if (subreceta === undefined) {
            throw new BadRequestException(
              'Una o más recetas proporcionados no existen en la base de datos.',
            );
          }
          relacion.subreceta = subreceta;
          relacion.cantidad = i.cantidad;

          return relacion;
        });
      }
    }

    const costo_total = this.calculateTotalForReceta(receta);
    receta.costo_total = costo_total.toFixed(2);
    const unidades = parseFloat(receta.unidades_por_receta);
    // Prevents division by zero
    receta.costo_unidad =
      unidades > 0 ? (costo_total / unidades).toFixed(2) : '0';

    return this.recetasRepository.save(receta);
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
        'subrecetas.subreceta',
      ],
      withDeleted: true,
    });
    if (!receta) {
      throw new NotFoundException(`Receta con id ${id} no encontrada.`);
    }
    await this.recetasRepository.recover(receta);
  }

  private calculateTotalForReceta(receta: Receta): number {
    let costo_total = 0;
    if (receta.subrecetas && receta.subrecetas.length > 0) {
      receta.subrecetas.map((sr) => {
        const costo_unidad = parseFloat(sr.subreceta.costo_unidad);
        const unidades = parseFloat(sr.cantidad);
        costo_total += costo_unidad * unidades;
      });
    }

    if (receta.insumos && receta.insumos.length > 0) {
      receta.insumos.map((i) => {
        const costo_unidad = parseFloat(i.insumo.costo_unidad_medida);
        const unidades = parseFloat(i.cantidad);
        costo_total += costo_unidad * unidades;
      });
    }
    return costo_total;
  }
}
