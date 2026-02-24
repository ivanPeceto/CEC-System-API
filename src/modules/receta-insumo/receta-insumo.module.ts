import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaInsumo } from './entities/receta-insumo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaInsumo])],
})
export class RecetaInsumoModule {}
