import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRecetaInsumoDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo cantidad en insumos es obligatorio' })
  cantidad: string;

  @IsUUID()
  @IsNotEmpty({ message: 'El campo insumo es obligatorio' })
  insumo: string;
}
