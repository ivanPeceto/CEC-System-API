import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  costo_unidad_medida: string;
}
