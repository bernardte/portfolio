import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { ProjectService } from '../project/project.service';
import { SkillService } from '../skill/skill.service';
import { StrengthService } from '../strength/strength.service';
import { FileManagerService } from '../file-manager/file-manager.service';
import {
  FileCategory,
  FileOwnerType,
} from '../file-manager/entities/file.entity';
import { PortfolioRawData } from './interface/portfolio.interface';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly skillService: SkillService,
    private readonly strengthService: StrengthService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  async findOne(slug: string): Promise<PortfolioRawData> {
    const [profile, projects, skillCategories, strengths] = await Promise.all([
      this.profileService.findOneProfileBySlug(slug),
      this.projectService.findOneProjectBySlug(slug),
      this.skillService.findOneSkillBySlug(slug),
      this.strengthService.findStrengthsBySlug(slug),
    ]);

    return {
      profile: profile,
      projects: projects,
      skillCategories: skillCategories,
      strengths: strengths,
    };
  }

  async downloadResume(slug: string) {
    const profile = await this.profileService.getProfileBySlug(slug);

    if (!profile) throw new NotFoundException('User profile not found!');

    const resumeFile = await this.fileManagerService.getCurrentFile(
      profile.id,
      FileOwnerType.PROFILE,
      FileCategory.RESUME,
      true,
    );

    let resumeFileUrl;

    if (resumeFile) {
      resumeFileUrl = await this.fileManagerService.getFileUrl(
        profile.id,
        FileOwnerType.PROFILE,
        FileCategory.RESUME,
        'download',
        true,
      );
    }

    return {
      resumeDownloadFileUrl: resumeFileUrl.url ?? null,
      resumeFileName: resumeFile?.fileOriginalName ?? '',
    };
  }
}
