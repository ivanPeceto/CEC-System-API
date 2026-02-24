import { PartialType } from '@nestjs/mapped-types';
import { CreateMetodosPagoDto } from './create-metodos_pago.dto';

export class UpdateMetodosPagoDto extends PartialType(CreateMetodosPagoDto) {}
