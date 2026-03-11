import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from 'src/common/decorators/public/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    this.authService.setCookies(res, tokens);
    return { message: 'Autenticación exitosa' };
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signUp(createUserDto);
    this.authService.setCookies(res, tokens);
    return { message: 'Usuario creado exitosamente' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.sub;
    await this.authService.logout(userId);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Sesión cerrada' };
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshTokens(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;

    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.authService.setCookies(res, tokens);
    return { message: 'Tokens actualizados' };
  }

  @Get('me')
  async getProfile(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.sub;
    if (typeof userId === 'string') {
      return await this.authService.getProfile(userId);
    }
  }
}
