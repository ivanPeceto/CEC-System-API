import { PartialType } from '@nestjs/mapped-types';
import { CreateRecetaInsumoDto } from './create-receta-insumo.dto';

export class UpdateRecetaInsumoDto extends PartialType(CreateRecetaInsumoDto) {}
