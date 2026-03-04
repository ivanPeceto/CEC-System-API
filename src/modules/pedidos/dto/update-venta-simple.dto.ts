import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaSimpleDto } from './create-venta-simple.dto';

export class UpdateVentaSimpleDto extends PartialType(CreateVentaSimpleDto) {}
