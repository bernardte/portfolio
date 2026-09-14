import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (request && request.cookies) {
            return request.cookies['accessToken'] || null;
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>(
        'authconfig.jwt_access_token_secret',
      ),
    });
  }

  async validate(payload: { sub: User['id'] }) {
    try {
      const { user } = await this.authService.findById(payload.sub);

      const { password, ...result } = user;

      console.log('jwt-user: ', user);

      return {
        ...result,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Token!');
    }
  }
}
