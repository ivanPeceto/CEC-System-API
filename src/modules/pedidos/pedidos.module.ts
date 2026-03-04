import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from '../pedido-producto/entities/pedido-producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { PedidoProductoModule } from '../pedido-producto/pedido-producto.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoProducto, Cliente]),
    PedidoProductoModule,
    ClientesModule,
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
