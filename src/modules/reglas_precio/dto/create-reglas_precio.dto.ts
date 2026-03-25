import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReglasPrecioDto {
  @IsNotEmpty({ message: 'El campo producto es obligatorio.' })
  @IsUUID('all', { message: 'El ID de la categoría debe ser un UUID válido' })
  producto: string;

  @IsNotEmpty({ message: 'El campo cantidad_producto es obligatorio.' })
  @IsString()
  cantidad_producto: string;

  @IsNotEmpty({ message: 'El campo precio_fijo es obligatorio.' })
  @IsString()
  precio_fijo: string;
}
