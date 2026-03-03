import { Module } from '@nestjs/common';
import { ReglasPrecioService } from './reglas_precio.service';
import { ReglasPrecioController } from './reglas_precio.controller';

@Module({
  controllers: [ReglasPrecioController],
  providers: [ReglasPrecioService],
})
export class ReglasPrecioModule {}
