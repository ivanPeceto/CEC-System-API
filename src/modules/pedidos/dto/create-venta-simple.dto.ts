import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreatePedidoProductoDto } from 'src/modules/pedido-producto/dto/create-pedido-producto.dto';

export class CreateVentaSimpleDto {
  @IsOptional()
  @IsDateString()
  datetime?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoProductoDto)
  pedido_productos: CreatePedidoProductoDto[];
}
