import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaSubreceta } from './entities/receta-subreceta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaSubreceta])],
})
export class RecetaSubrecetaModule {}
