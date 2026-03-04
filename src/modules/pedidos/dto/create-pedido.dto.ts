import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { CreatePedidoProductoDto } from 'src/modules/pedido-producto/dto/create-pedido-producto.dto';
import { Estados } from 'src/types/pedidos.types';

export class CreatePedidoDto {
  @IsDateString()
  @IsOptional()
  datetime?: Date;

  @IsString()
  @Matches(/^[1-9][0-9]*$/, {
    message: 'El numero es inválido.',
  })
  @IsOptional()
  numero?: string;

  @IsNotEmpty({ message: 'El campo cliente es obligatorio.' })
  @IsUUID('all', {
    message: 'El campo cliente proporcionado no es un UUID válido',
  })
  cliente: string;

  @IsDateString()
  @IsOptional()
  para_hora?: Date;

  @IsOptional()
  @IsEnum(Estados)
  estado?: Estados;

  @IsOptional()
  @IsBoolean()
  pagado?: boolean;

  @IsOptional()
  @IsBoolean()
  avisado?: boolean;

  @IsNotEmpty({
    message:
      'El campo pedido_productos es obligatorio. Un pedido debe tener al menos un producto.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoProductoDto)
  pedido_productos: CreatePedidoProductoDto[];
}
