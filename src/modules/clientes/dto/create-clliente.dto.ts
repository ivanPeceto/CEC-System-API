import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo nombre del cliente es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9\s\-\+]+$/, {
    message:
      'El telefono solo puede contener números, espacios o guiones (-) y el signo (+).',
  })
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
