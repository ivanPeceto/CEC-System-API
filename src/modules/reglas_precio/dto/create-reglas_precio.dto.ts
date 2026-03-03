import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateReglasPrecioDto {
  @IsNotEmpty({ message: 'El campo producto es obligatorio.' })
  @IsUUID('all', { message: 'El ID de la categoría debe ser un UUID válido' })
  producto: string;

  @IsNotEmpty({ message: 'El campo cantidad_producto es obligatorio.' })
  @IsString()
  @Matches(/^[1-9][0-9]*$/, {
    message: 'El cantidad_producto es inválido.',
  })
  cantidad_producto: string;

  @IsNotEmpty({ message: 'El campo precio_fijo es obligatorio.' })
  @IsString()
  @Matches(/^\\d+\\.\\d{2}$/, {
    message: 'El precio_fijo es inválido.',
  })
  precio_fijo: string;
}
