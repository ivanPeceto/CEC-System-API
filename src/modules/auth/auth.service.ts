import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtPayload, Tokens } from 'src/types/auth.payloads';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { Roles } from 'src/types/users.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(email);
    const isMatch = await compare(pass, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol,
    };
    const tokens = await this.getTokens(user.id, payload);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    await this.userService.update(userId, { currentRefreshToken: null });
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService
      .create(createUserDto)
      .catch((err: unknown) => {
        // Checks that err is an object and has a code propierty
        if (err && typeof err === 'object' && 'code' in err) {
          const dbError = err as { code: string | number };

          // MYSQL error code 1062 for Duplicate Entrys
          if (
            dbError.code === 'ER_DUP_ENTRY' ||
            dbError.code === 1062 ||
            dbError.code === '23505'
          ) {
            throw new ConflictException('El email ya está registrado.');
          }

          // If it's not an MySQL Duplicate Entry error it just throws  a generic 500 error
          console.error(err);
          throw new InternalServerErrorException(
            'Error al crear el usuario. Intente nuevamente.',
          );
        }
      });

    if (!user) {
      throw new InternalServerErrorException(
        'Error al crear el usuario. Intente nuevamente.',
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol,
    };
    const tokens = await this.getTokens(user.id, payload);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new ForbiddenException('Acceso denegado. Usuario inválido.');
    }

    if (!user.currentRefreshToken) {
      throw new ForbiddenException(`Acceso denegado. Refresh token inválido.`);
    }

    const refreshTokenMatches = await compare(
      refreshToken,
      user.currentRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Acceso denegado');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol,
    };
    const tokens = await this.getTokens(user.id, payload);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashRefreshToken = await hash(refreshToken, 10);
    await this.userService.update(userId, {
      currentRefreshToken: hashRefreshToken,
    });
  }

  private async getTokens(
    userId: string,
    payload: JwtPayload,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '4h',
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '5d',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async refreshTokensFromRequest(refreshToken: string): Promise<Tokens> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new ForbiddenException('Refresh token inválido o expirado');
    }
    const userId = payload.sub;
    return this.refreshTokens(userId, refreshToken);
  }

  /** To test if an user is admin. Devs only
  async adminend(signInDto: SignInDto): Promise<any> {
    const user = await this.userService.findOneByEmail(signInDto.email);
    if (user.rol == Roles.ADMIN) {
      return { message: 'Eres admin tio' };
    } else {
      throw new ForbiddenException('No sos admin capo');
    }
  }
     */
}
