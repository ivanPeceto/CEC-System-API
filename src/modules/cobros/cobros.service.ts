import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cobro } from './entities/cobro.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { PedidosService } from '../pedidos/pedidos.service';
import { MetodosPagoService } from '../metodos_pago/metodos_pago.service';

@Injectable()
export class CobrosService {
  constructor(
    @InjectRepository(Cobro)
    private readonly cobrosRepository: Repository<Cobro>,
    private readonly pedidoService: PedidosService,
    private readonly metodosService: MetodosPagoService,
  ) {}
  async create(createCobroDto: CreateCobroDto) {
    const pedido = await this.pedidoService.findOne(
      createCobroDto.pedido,
      true,
    );
    const metodoPago = await this.metodosService.findOne(createCobroDto.metodo);
    const monto = parseFloat(createCobroDto.monto);

    const cobro = this.cobrosRepository.create({
      pedido: pedido,
      metodo: metodoPago,
      datetime: new Date(),
    });

    const recargo_porcentual: number = metodoPago.recargo
      ? parseFloat(metodoPago.recargo) / 100
      : 0;
    const descuento_porcentual: number = metodoPago.descuento
      ? parseFloat(metodoPago.descuento) / 100
      : 0;

    const monto_final: number =
      monto + monto * recargo_porcentual - monto * descuento_porcentual;

    cobro.monto = monto_final.toFixed(2);
    return await this.cobrosRepository.save(cobro);
  }

  async findAll() {
    return await this.cobrosRepository.find({
      relations: ['pedido', 'metodo'],
    });
  }

  async findSoftDeleted() {
    return await this.cobrosRepository.find({
      relations: ['pedido', 'metodo'],
      where: {
        deletedAt: Not(IsNull()),
      },
    });
  }

  async findOne(id: string) {
    const cobro = await this.cobrosRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!cobro) {
      throw new NotFoundException(`Cobro con id ${id} no encontrado.`);
    }
    return cobro;
  }

  async update(id: string, updateCobroDto: UpdateCobroDto) {
    const cobro = await this.findOne(id);
    cobro.monto = updateCobroDto.monto ? updateCobroDto.monto : cobro.monto;

    if (updateCobroDto.pedido) {
      const pedido = await this.pedidoService.findOne(updateCobroDto.pedido);
      cobro.pedido = pedido;
    }
    if (updateCobroDto.metodo) {
      const metodo = await this.metodosService.findOne(updateCobroDto.metodo);
      if (cobro.metodo.id !== metodo.id) {
        const monto = parseFloat(cobro.monto);
        const recargo_porcentual: number = metodo.recargo
          ? parseFloat(metodo.recargo) / 100
          : 0;
        const descuento_porcentual: number = metodo.descuento
          ? parseFloat(metodo.descuento) / 100
          : 0;

        const monto_final: number =
          monto + monto * recargo_porcentual - monto * descuento_porcentual;

        cobro.monto = monto_final.toFixed(2);
      }
    }

    return await this.cobrosRepository.save(cobro);
  }

  async delete(id: string) {
    const cobro = await this.findOne(id);
    return await this.cobrosRepository.softRemove(cobro);
  }

  async hardDelete(id: string) {
    const cobro = await this.findOne(id);
    return await this.cobrosRepository.remove(cobro);
  }

  async restore(id: string) {
    const cobro = await this.cobrosRepository.findOne({
      where: {
        id: id,
      },
      relations: ['metodo', 'pedido'],
      withDeleted: true,
    });
    if (!cobro) {
      throw new NotFoundException(`Cobro con id  ${id} no encontrado.`)
    }
    return await this.cobrosRepository.restore(cobro);
  }

  async findAllFacturables() {
    const cobros = await this.cobrosRepository.find({
      relations: ['metodo', 'pedido'],
      where: {
        metodo: {
          facturable: true,
        },
      },
    });
    return cobros;
  }

  async findAllByPedido(pedido_id: string) {
    const cobros = await this.cobrosRepository.find({
      relations: ['metodo', 'pedido'],
      where: {
        pedido: {
          id: pedido_id,
        },
      },
    });
    return cobros;
  }
}
