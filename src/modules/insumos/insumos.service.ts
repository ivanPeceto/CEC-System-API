import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Insumo } from './entities/insumo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Receta } from '../recetas/entities/receta.entity';
import { InsumoUpdatedEvent } from './events/update-insumo.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RecetaInsumo } from '../receta-insumo/entities/receta-insumo.entity';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumosRepository: Repository<Insumo>,
    @InjectRepository(Receta)
    private readonly recetasRepository: Repository<Receta>,
    @InjectRepository(RecetaInsumo)
    private readonly recetasInsumosRepository: Repository<RecetaInsumo>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createInsumoDto: CreateInsumoDto) {
    const insumo = this.insumosRepository.create(createInsumoDto);
    return await this.insumosRepository.save(insumo);
  }

  async findAll(): Promise<Insumo[]> {
    const insumos = await this.insumosRepository.find();
    return insumos;
  }

  async findOne(id: string): Promise<Insumo> {
    const insumo = await this.insumosRepository.findOneBy({ id });
    if (!insumo) {
      throw new NotFoundException(`Insumo con id ${id} no encontrado.`);
    }
    return insumo;
  }

  async findOneByName(name: string): Promise<Insumo> {
    const insumo = await this.insumosRepository.findOneBy({ nombre: name });
    if (!insumo) {
      throw new NotFoundException(`Insumo con nombre ${name} no encontrado.`);
    }
    return insumo;
  }

  async findRecetasWhoUseIt(idInsumo: string) {
    const relaciones = await this.recetasInsumosRepository.find({
      where: { insumo: { id: idInsumo } },
      relations: ['receta'],
    });

    if (relaciones.length === 0) return [];

    const recetaIds = [...new Set(relaciones.map((r) => r.receta.id))];

    return await this.recetasRepository.find({
      where: { id: In(recetaIds) },
      relations: [
        'insumos',
        'insumos.insumo',
        'subrecetas',
        'subrecetas.subreceta',
      ],
    });
  }

  async update(id: string, updateInsumoDto: UpdateInsumoDto) {
    const insumo = await this.findOne(id);
    const costoAnterior = insumo.costo_unidad_medida;

    this.insumosRepository.merge(insumo, updateInsumoDto);
    const insumoSaved = await this.insumosRepository.save(insumo);

    if (costoAnterior !== insumoSaved.costo_unidad_medida) {
      const insumoUpdatedEvent = new InsumoUpdatedEvent();
      insumoUpdatedEvent.insumoId = insumoSaved.id;
      this.eventEmitter.emit('insumo.price.updated', insumoUpdatedEvent);
    }

    return insumoSaved;
  }

  async delete(id: string): Promise<void> {
    const deletedInsumo = await this.insumosRepository.delete(id);
    if (deletedInsumo.affected === 0) {
      throw new NotFoundException(`Insumo con id ${id} no encontrado.`);
    }
  }

  async softDelete(id: string): Promise<void> {
    const deletedInsumo = await this.insumosRepository.softDelete(id);
    if (deletedInsumo.affected === 0) {
      throw new NotFoundException(`Insumo con id ${id} no encontrado.`);
    }
  }

  async restore(id: string): Promise<void> {
    const restored = await this.insumosRepository.restore(id);
    if (restored.affected === 0) {
      throw new NotFoundException(`Insumo con id ${id} no encontrado.`);
    }
  }

  async findSoftDeleted(): Promise<Insumo[]> {
    return await this.insumosRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
    });
  }
}
