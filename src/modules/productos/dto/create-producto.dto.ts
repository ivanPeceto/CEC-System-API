import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El campo nombre es obligatorio.' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'El campo nombre_impresion es obligatorio.' })
  @IsString()
  nombre_impresion: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty({ message: 'El campo precio_unitario es obligatorio.' })
  @IsString()
  @Matches(/^\\d+\\.\\d{2}$/, {
    message: 'El precio unitario es inválido.',
  })
  precio_unitario: string;

  @IsNotEmpty({ message: 'Es obligatorio definir la categoría' })
  @IsUUID('all', { message: 'El ID de la categoría debe ser un UUID válido' })
  categoria: string;

  @IsOptional()
  @IsUUID('all', { message: 'El ID de la categoría debe ser un UUID válido' })
  receta?: string;
}
