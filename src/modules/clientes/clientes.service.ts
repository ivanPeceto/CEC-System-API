import { Injectable, NotFoundException } from '@nestjs/common';
import { Cliente } from './entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-clliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clientesRepository.create(createClienteDto);
    return await this.clientesRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return await this.clientesRepository.find();
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOneBy({ id });
    if (!cliente) {
      throw new NotFoundException(`Clietne con id ${id} no encontrado.`);
    }
    return cliente;
  }

  async findManyByName(name: string): Promise<Cliente[]> {
    const clientes = await this.clientesRepository.findBy({ nombre: name });
    return clientes;
  }

  async update(
    id: string,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.findOne(id);
    this.clientesRepository.merge(cliente, updateClienteDto);
    return await this.clientesRepository.save(cliente);
  }

  async delete(id: string): Promise<void> {
    const deletedCliente = await this.clientesRepository.delete(id);
    if (deletedCliente.affected === 0) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado.`);
    }
  }

  async softDelete(id: string): Promise<void> {
    const deletedCliente = await this.clientesRepository.softDelete(id);
    if (deletedCliente.affected === 0) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado.`);
    }
  }

  async restore(id: string): Promise<void> {
    const restored = await this.clientesRepository.restore(id);
    if (restored.affected === 0) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado.`);
    }
  }
}
