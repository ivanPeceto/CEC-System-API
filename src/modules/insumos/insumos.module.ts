import { Module } from '@nestjs/common';
import { InsumosController } from './insumos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insumo } from './entities/insumo.entity';
import { InsumoUpdatedListener } from './listeners/update-insumo.listener';
import { RecetaInsumo } from '../receta-insumo/entities/receta-insumo.entity';
import { RecetaSubreceta } from '../receta-subreceta/entities/receta-subreceta.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { RecetasService } from '../recetas/recetas.service';
import { RecetasModule } from '../recetas/recetas.module';
import { InsumosService } from './insumos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Insumo, RecetaInsumo, RecetaSubreceta, Receta]),
    RecetasModule,
  ],
  controllers: [InsumosController],
  providers: [InsumosService, RecetasService, InsumoUpdatedListener],
  exports: [InsumosService],
})
export class InsumosModule {}
