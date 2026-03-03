import { Module } from '@nestjs/common';
import { ReglasPrecioService } from './reglas_precio.service';
import { ReglasPrecioController } from './reglas_precio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReglasPrecio } from './entities/reglas_precio.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReglasPrecio, Producto])],
  controllers: [ReglasPrecioController],
  providers: [ReglasPrecioService],
  exports: [ReglasPrecioService],
})
export class ReglasPrecioModule {}
