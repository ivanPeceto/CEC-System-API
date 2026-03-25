import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from '../pedido-producto/entities/pedido-producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { PedidoProductoModule } from '../pedido-producto/pedido-producto.module';
import { ClientesModule } from '../clientes/clientes.module';
import { ReglasPrecioModule } from '../reglas_precio/reglas_precio.module';
import { ProductosModule } from '../productos/productos.module';
import { VentaSimpleController } from './venta-simple.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoProducto, Cliente]),
    PedidoProductoModule,
    ClientesModule,
    ReglasPrecioModule,
    ProductosModule,
  ],
  controllers: [PedidosController, VentaSimpleController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}
