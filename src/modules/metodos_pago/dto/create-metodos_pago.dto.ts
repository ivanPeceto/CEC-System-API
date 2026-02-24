import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMetodosPagoDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  nombre: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'El campo facturable es obligatorio' })
  facturable: boolean;

  @IsString()
  @IsOptional()
  recargo?: string;

  @IsString()
  @IsOptional()
  descuento?: string;
}
