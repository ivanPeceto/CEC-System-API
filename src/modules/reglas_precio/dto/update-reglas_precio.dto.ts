import { PartialType } from '@nestjs/mapped-types';
import { CreateReglasPrecioDto } from './create-reglas_precio.dto';

export class UpdateReglasPrecioDto extends PartialType(CreateReglasPrecioDto) {}
