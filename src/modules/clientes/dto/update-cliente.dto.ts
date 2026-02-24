import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-clliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
