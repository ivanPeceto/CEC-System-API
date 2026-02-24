import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Formato de email incorrecto' })
  @IsNotEmpty({ message: 'El campo email es obligatorio' })
  email: string;

  @IsNotEmpty({ message: 'El campo contraseña es obligatorio' })
  password: string;
}
