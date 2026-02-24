import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateInsumoDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo unidad_medida es obligatorio' })
  unidad_medida: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo costo_unidad_medida es obligatorio' })
  @Matches(/^\\d+\\.\\d{2}$/, {
    message: 'El precio por unidad de medida es inválido.',
  })
  costo_unidad_medida: string;
}
