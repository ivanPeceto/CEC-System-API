import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoProducto } from './entities/pedido-producto.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoProducto, Pedido, Producto])],
})
export class PedidoProductoModule {}
