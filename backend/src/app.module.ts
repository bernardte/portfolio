import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './config/auth.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { ProjectModule } from './project/project.module';
import { ContactMessageModule } from './contact-message/contact-message.module';
import databaseConfig from './config/database.config';
import cloudinaryConfig from './config/cloudinary.config';
import { StrengthModule } from "./strength/strength.module";
import { SkillModule } from "./skill/skill.module";
import { FileUploadModule } from './file-upload/file-upload.module';
import { CloudinaryModule } from './file-upload/cloudinary/cloudinary.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [authConfig, databaseConfig, cloudinaryConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return configService.getOrThrow('databaseconfig');
      },
    }),
    AuthModule,
    ProfileModule,
    ProjectModule,
    ContactMessageModule,
    StrengthModule,
    SkillModule,
    CloudinaryModule,
    FileUploadModule,
    PortfolioModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
