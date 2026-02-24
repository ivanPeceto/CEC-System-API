import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';
import { RecetaInsumo } from '../receta-insumo/entities/receta-insumo.entity';
import { Insumo } from '../insumos/entities/insumo.entity';
import { RecetaSubreceta } from '../receta-subreceta/entities/receta-subreceta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receta, RecetaInsumo, RecetaSubreceta, Insumo]),
  ],
  controllers: [RecetasController],
  providers: [RecetasService],
})
export class RecetasModule {}
