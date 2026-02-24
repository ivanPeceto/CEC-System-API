import { PartialType } from '@nestjs/mapped-types';
import { CreateRecetaSubrecetaDto } from './create-receta-subreceta.dto';

export class UpdateRecetaSubrecetaDto extends PartialType(CreateRecetaSubrecetaDto) {}
