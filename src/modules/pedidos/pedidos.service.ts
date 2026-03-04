import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Between, Repository } from 'typeorm';
import { PedidoProducto } from '../pedido-producto/entities/pedido-producto.entity';
import { ClientesService } from '../clientes/clientes.service';
import { Estados } from 'src/types/pedidos.types';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepo: Repository<Pedido>,
    @InjectRepository(PedidoProducto)
    private readonly pedidosProductosRepo: Repository<PedidoProducto>,
    private readonly clientesService: ClientesService,
  ) {}

  async createPedido(createPedidoDto: CreatePedidoDto) {
    //Validates cliente id
    const cliente = await this.clientesService.findOne(createPedidoDto.cliente);

    if (createPedidoDto.pedido_productos.length === 0) {
      throw new BadRequestException(
        'Un pedido debe tener al menos un producto relacionado.',
      );
    }

    const pedidoDate: Date = createPedidoDto.datetime
      ? createPedidoDto.datetime
      : new Date();

    const countPedidos = await this.countPedidosByDate(pedidoDate);
    const pedidoNumero: number = createPedidoDto.numero
      ? createPedidoDto.numero
      : countPedidos + 1;

    const pedido = this.pedidosRepo.create({
      datetime: pedidoDate,
      numero: pedidoNumero,
      cliente: cliente,
      para_hora: createPedidoDto.para_hora,
      estado: createPedidoDto.estado ?? Estados.PENDIENTE,
      pagado: createPedidoDto.pagado ?? false,
      avisado: createPedidoDto.avisado ?? false,
    });
    
    return 'This action adds a new pedido';
  }

  async findAll() {
    return await this.pedidosRepo.find();
  }

  async findOne(id: string) {
    const pedido = await this.pedidosRepo.findOne({
      where: { id },
      relations: ['pedido_productos', 'producto', 'cliente'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado.`);
    }
    return pedido;
  }

  async findManyByDate(date: Date) {
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const endDate = new Date(date.setHours(23, 59, 59, 999));
    const pedidos: Pedido[] = await this.pedidosRepo.find({
      where: { datetime: Between(startDate, endDate) },
      relations: ['pedido_productos', 'producto', 'cliente'],
    });
    return pedidos;
  }

  async findOneByDateAndNumero(date: Date, number: number) {
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const endDate = new Date(date.setHours(23, 59, 59, 999));
    const pedido = await this.pedidosRepo.findOne({
      where: { datetime: Between(startDate, endDate), numero: number },
      relations: ['pedido_productos', 'producto', 'cliente'],
    });
    return pedido;
  }

  async countPedidosByDate(date: Date) {
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const endDate = new Date(date.setHours(23, 59, 59, 999));
    const total_pedidos = await this.pedidosRepo.count({
      where: { datetime: Between(startDate, endDate) },
    });
    return total_pedidos;
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }
}
