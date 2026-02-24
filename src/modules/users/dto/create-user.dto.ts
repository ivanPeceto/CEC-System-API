import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo nombre de usuario es obligatorio' })
  username: string;

  @IsEmail({}, { message: 'Formato de email incorrecto' })
  @IsNotEmpty({ message: 'El campo email es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo contraseña es obligatorio' })
  password: string;
}
