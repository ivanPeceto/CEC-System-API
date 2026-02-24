import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @IsNotEmpty({ message: 'El campo nombre de la categoria es obligatorio' })
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
