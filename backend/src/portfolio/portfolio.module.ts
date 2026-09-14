import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { ProfileModule } from '../profile/profile.module';
import { ProjectModule } from '../project/project.module';
import { SkillModule } from '../skill/skill.module';
import { StrengthModule } from '../strength/strength.module';
import { AuthModule } from '../auth/auth.module';
import { FileManagerModule } from '../file-manager/file-manager.module';

@Module({
  imports: [
    ProfileModule,
    ProjectModule,
    SkillModule,
    StrengthModule,
    AuthModule,
    FileManagerModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
