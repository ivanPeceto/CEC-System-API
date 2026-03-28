import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetodosPagoDto } from './dto/create-metodos_pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos_pago.dto';
import { IsNull, Not, Repository } from 'typeorm';
import { MetodosPago } from './entities/metodos_pago.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodosPago)
    private readonly metodosRepository: Repository<MetodosPago>,
  ) {}

  async create(createMetodosPagoDto: CreateMetodosPagoDto) {
    const metodo = this.metodosRepository.create(createMetodosPagoDto);
    return await this.metodosRepository.save(metodo);
  }

  async findAll() {
    return await this.metodosRepository.find();
  }

  async findOne(id: string) {
    const metodo = await this.metodosRepository.findOneBy({ id });
    if (!metodo) {
      throw new NotFoundException(`Metodo de pago con id ${id} no encontrado.`);
    }
    return metodo;
  }

  async update(id: string, updateMetodosPagoDto: UpdateMetodosPagoDto) {
    const metodo = await this.findOne(id);
    this.metodosRepository.merge(metodo, updateMetodosPagoDto);
    return await this.metodosRepository.save(metodo);
  }

  async delete(id: string) {
    const deletedMetodo = await this.metodosRepository.delete(id);
    if (deletedMetodo.affected === 0) {
      throw new NotFoundException(`Metodo de pago con id ${id} no encontrado.`);
    }
  }

  async softDelete(id: string) {
    const deletedMetodo = await this.metodosRepository.softDelete(id);
    if (deletedMetodo.affected === 0) {
      throw new NotFoundException(`Metodo de pago con id ${id} no encontrado.`);
    }
  }

  async restore(id: string) {
    const deletedMetodo = await this.metodosRepository.restore(id);
    if (deletedMetodo.affected === 0) {
      throw new NotFoundException(`Metodo de pago con id ${id} no encontrado.`);
    }
  }

  async findSoftDeleted(): Promise<MetodosPago[]> {
    return await this.metodosRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()), 
      },
    });
  }
}
