import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateCobroDto {
  @IsNotEmpty({ message: 'El campo pedido es obligatorio' })
  @IsUUID('all', { message: 'El ID del pedido debe ser un UUID válido' })
  pedido: string;

  @IsNotEmpty({ message: 'El campo metodo es obligatorio' })
  @IsUUID('all', { message: 'El ID del metodo debe ser un UUID válido' })
  metodo: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\\d+\\.\\d{2}$/, {
    message: 'El monto es inválido.',
  })
  monto: string;
}
