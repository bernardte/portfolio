import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ProfileModule } from '../profile/profile.module';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  //! imports: 我要使用别人提供的东西
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>(
          'authconfig.jwt_access_token_secret',
        ),
      }),
    }),
    TypeOrmModule.forFeature([User]),
    ProfileModule,
  ],
  //! exports: 我要让其他 Module 使用我的东西 ("其他 Module 也可以用")
  exports: [JwtAuthGuard, AuthService],
  //! controllers: HTTP 请求进来的地方
  controllers: [AuthController],
  //! provider： 我这个 Module 自己提供的服务 ("我自己可以用")
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
