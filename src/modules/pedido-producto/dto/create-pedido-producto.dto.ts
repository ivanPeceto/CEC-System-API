import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePedidoProductoDto {
  //@IsNotEmpty({ message: 'El campo pedido es obligatorio.' })
  //@IsUUID('all', { message: 'El ID del pedido debe ser un UUID válido' })
  //pedido: string;

  @IsNotEmpty({ message: 'El campo producto es obligatorio.' })
  @IsUUID('all', { message: 'El ID del producto debe ser un UUID válido' })
  producto: string;

  @IsNotEmpty({ message: 'El campo cantidad_producto es obligatorio.' })
  @IsString()
  cantidad_producto: string;

  @IsOptional()
  @IsString()
  aclaraciones?: string;
}
