import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileManagerModule } from '../file-manager/file-manager.module';
import { Project } from '../project/entities/project.entity';
import { SkillItem } from '../skill/entities/skill-item.entity';
import { Strength } from '../strength/entities/strength.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Project, SkillItem, Strength]),
    MulterModule.register({ storage: memoryStorage() }),
    FileUploadModule,
    FileManagerModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
