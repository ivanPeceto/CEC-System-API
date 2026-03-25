import { Module } from '@nestjs/common';
import { CobrosService } from './cobros.service';
import { CobrosController } from './cobros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cobro } from './entities/cobro.entity';
import { PedidosModule } from '../pedidos/pedidos.module';
import { MetodosPagoModule } from '../metodos_pago/metodos_pago.module';
import { MetodosPago } from '../metodos_pago/entities/metodos_pago.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cobro, Pedido, MetodosPago]),
    PedidosModule,
    MetodosPagoModule,
  ],
  controllers: [CobrosController],
  providers: [CobrosService],
})
export class CobrosModule {}
