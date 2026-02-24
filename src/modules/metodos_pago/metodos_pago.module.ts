import { Module } from '@nestjs/common';
import { MetodosPagoService } from './metodos_pago.service';
import { MetodosPagoController } from './metodos_pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodosPago } from './entities/metodos_pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetodosPago])],
  controllers: [MetodosPagoController],
  providers: [MetodosPagoService],
})
export class MetodosPagoModule {}
