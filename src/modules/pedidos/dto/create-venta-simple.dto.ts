import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreatePedidoProductoDto } from 'src/modules/pedido-producto/dto/create-pedido-producto.dto';

export class CreateVentaSimpleDto {
  @IsOptional()
  @IsDateString()
  datetime?: Date;

  @IsOptional()
  @IsUUID('all', {
    message: 'El campo cliente proporcionado no es un UUID válido',
  })
  cliente?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoProductoDto)
  pedido_productos: CreatePedidoProductoDto[];
}
