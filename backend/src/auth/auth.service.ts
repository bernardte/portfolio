import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/entities/profile.entity';
import slugify from 'slugify';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private profileService: ProfileService,
    private configService: ConfigService,
  ) {}

  private async verifyPassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRound = 10;
    return bcrypt.hash(password, saltOrRound);
  }

  private generateToken(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const jwtAccessTokenSecret = this.configService.get<string>(
      'authconfig.jwt_access_token_secret',
    );

    return this.jwtService.sign(payload, {
      secret: jwtAccessTokenSecret,
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
    };

    const jwtRefreshTokenSecret = this.configService.getOrThrow<string>(
      'authconfig.jwt_refresh_token_secret',
    );

    return this.jwtService.sign(payload, {
      secret: jwtRefreshTokenSecret,
      expiresIn: '7d',
    });
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        `${registerDto.email} already in use! Please try with a differentt email`,
      );
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const newlyCreatedUser = this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newlyCreatedUser);

    const slug = slugify(registerDto.name, {
      lower: true,
      strict: true,
    });

    await this.profileService.create(
      {
        highestEducationLevel: '',
        bio: '',
        location: '',
        slug,
      },
      savedUser,
    );

    const { password, ...result } = savedUser;

    return {
      user: result,
      message: 'Admin user register successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Invalid credentials or account not exists',
      );
    }

    const tokens = this.generateToken(user);
    const { password, ...result } = user;

    return {
      user: result,
      ...tokens,
    };
  }

  async findById(userId: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return {
      user: user,
    };
  }

  async findOneUserByName(name: string) {
    const user = await this.userRepository.findOneBy({ name: name });

    if (!user) throw new NotFoundException(`User ${user} not found!`);

    return user;
  }

  async refreshAccessToken(refreshToken: string) {
    const refreshSecret = this.configService.getOrThrow<string>(
      'authconfig.jwt_refresh_token_secret', // 统一用命名空间配置,别再混用扁平 key
    );
    const accessSecret = this.configService.getOrThrow<string>(
      'authconfig.jwt_access_token_secret',
    );

    console.log('Refresh Secret: ', refreshSecret);
    console.log('Access Secret: ', accessSecret);

    let payload: { sub: string };
    try {
      payload = await this.jwtService.verifyAsync<{ sub: string }>(
        refreshToken,
        { secret: refreshSecret },
      );

      console.log('payload: ', payload);
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 顺带确认用户仍然存在(避免用户被删除后 token 还能用)
    await this.findById(payload.sub);

    const newAccessToken = await this.jwtService.signAsync(
      { sub: payload.sub },
      { secret: accessSecret, expiresIn: '15m' },
    );

    // 关键:同时签发新的 refreshToken,做轮换
    // const newRefreshToken = await this.jwtService.signAsync(
    //   { sub: payload.sub },
    //   { secret: refreshSecret, expiresIn: '7d' },
    // );

    return { accessToken: newAccessToken };
  }

  async getUserInfo(user: User) {
    const userProfile = await this.profileService.getUserProfileAvatarByUserId(
      user.id,
    );

    return {
      ...user,
      avatar: userProfile,
    };
  }

  async getUserProfile(user: User) {
    const userProfile = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        profile: true,
        projects: true,
      },
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found!');
    }

    return userProfile;
  }
}
