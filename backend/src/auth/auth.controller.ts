import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response, CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

// 统一 Cookie 配置选项
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'lax',
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: User) {
    return await this.authService.getUserInfo(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(loginDto);

    response.cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000, // 15 分钟
    });

    response.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });

    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken', COOKIE_OPTIONS);
    response.clearCookie('refreshToken', COOKIE_OPTIONS);

    return { message: 'Logout successful' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 安全读取：兼顾 cookies 和 signedCookies
    const refreshToken =
      req.cookies.refreshToken || req.signedCookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);
    console.log('New access token generated:', !!accessToken);

    res.cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    console.log('accessToken: ', accessToken);

    return { message: 'Token refreshed successfully' };
  }
}
