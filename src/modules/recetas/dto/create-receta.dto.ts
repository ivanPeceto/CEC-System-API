import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRecetaInsumoDto } from 'src/modules/receta-insumo/dto/create-receta-insumo.dto';
import { CreateRecetaSubrecetaDto } from 'src/modules/receta-subreceta/dto/create-receta-subreceta.dto';

export class CreateRecetaDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo unidad_medida es obligatorio' })
  unidad_medida: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo unidades_por_receta es obligatorio' })
  unidades_por_receta: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecetaInsumoDto)
  insumos: CreateRecetaInsumoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecetaSubrecetaDto)
  subrecetas: CreateRecetaSubrecetaDto[];
}
