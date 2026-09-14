import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillCategory } from './entities/skill-categories.entity';
import { SkillItem } from './entities/skill-item.entity';
import { FileManagerModule } from '../file-manager/file-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillCategory]),
    TypeOrmModule.forFeature([SkillItem]),
    FileManagerModule,
  ],
  controllers: [SkillController],
  providers: [SkillService],
  exports: [SkillService]
})
export class SkillModule {}
