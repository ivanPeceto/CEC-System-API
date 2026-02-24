import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { Repository } from 'typeorm';
import { Insumo } from './entities/insumo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumosRepository: Repository<Insumo>,
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

  async update(id: string, updateInsumoDto: UpdateInsumoDto) {
    const insumo = await this.findOne(id);
    this.insumosRepository.merge(insumo, updateInsumoDto);
    return this.insumosRepository.save(insumo);
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
}
