import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRecetaSubrecetaDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo cantidad en subreceta es obligatorio' })
  cantidad: string;

  @IsUUID()
  @IsNotEmpty({ message: 'El campo subreceta es obligatorio' })
  subreceta: string;
}
