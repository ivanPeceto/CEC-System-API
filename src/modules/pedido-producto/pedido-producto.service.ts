import { Injectable } from '@nestjs/common';
import { CreatePedidoProductoDto } from './dto/create-pedido-producto.dto';
import { UpdatePedidoProductoDto } from './dto/update-pedido-producto.dto';

@Injectable()
export class PedidoProductoService {
  create(createPedidoProductoDto: CreatePedidoProductoDto) {
    return 'This action adds a new pedidoProducto';
  }

  findAll() {
    return `This action returns all pedidoProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pedidoProducto`;
  }

  update(id: number, updatePedidoProductoDto: UpdatePedidoProductoDto) {
    return `This action updates a #${id} pedidoProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedidoProducto`;
  }
}
