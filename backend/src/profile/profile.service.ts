import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { User } from '../auth/entities/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  FileCategory,
  FileOwnerType,
  FileResourceType,
} from '../file-manager/entities/file.entity';
import { FileManagerService } from '../file-manager/file-manager.service';
import { Project } from '../project/entities/project.entity';
import { SkillItem } from '../skill/entities/skill-item.entity';
import { Strength } from '../strength/entities/strength.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(SkillItem)
    private readonly skillItemRepository: Repository<SkillItem>,
    @InjectRepository(Strength)
    private readonly strengthRepository: Repository<Strength>,
    private readonly fileManagerService: FileManagerService,
  ) {}

  private calculateProfileCompletion({
    profile,
    projectsCount,
    skillsCount,
    strengthsCount,
    hasAvatar,
    hasResume,
  }: {
    profile: Profile;
    projectsCount: number;
    skillsCount: number;
    strengthsCount: number;
    hasResume: boolean;
    hasAvatar: boolean;
  }) {
    const completionConditions = [
      !!profile.highestEducationLevel?.trim(),
      !!profile.location?.trim(),
      !!profile.slug?.trim(),
      !!profile.linkedinLink?.trim(),
      !!profile.githubLink?.trim(),
      !!profile.bio?.trim(),
      !!profile.slug?.trim(),
      hasResume,
      hasAvatar,
      projectsCount > 0,
      skillsCount > 0,
      strengthsCount > 0,
    ];

    const completedCount = completionConditions.filter(Boolean).length;

    return Math.round((completedCount / completionConditions.length) * 100);
  }

  async getProfileSummary(user: User) {
    const profile = await this.profileRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const [projectsCount, skillsCount, strengthsCount] = await Promise.all([
      this.projectRepository.count({
        where: {
          userId: user.id,
        },
      }),
      this.skillItemRepository.count({
        where: {
          category: {
            userId: user.id,
          },
        },
      }),
      this.strengthRepository.count({
        where: {
          profileId: profile.id,
        },
      }),
    ]);

    const avatarUrl = await this.fileManagerService.getCurrentFile(
      profile.id,
      FileOwnerType.PROFILE,
      FileCategory.AVATAR,
      false,
    );

    const resumeUrl = await this.fileManagerService.getCurrentFile(
      profile.id,
      FileOwnerType.PROFILE,
      FileCategory.RESUME,
      true,
    );

    const payload = {
      profile,
      projectsCount,
      skillsCount,
      strengthsCount,
      hasResume: !!resumeUrl,
      hasAvatar: !!avatarUrl,
    };

    const completionPercentage = this.calculateProfileCompletion(payload);

    return {
      projectsCount: projectsCount ?? 0,
      skillsCount: skillsCount ?? 0,
      strengthsCount: strengthsCount ?? 0,
      completionPercentage: completionPercentage ?? 0,
    };
  }

  async create(createProfileDto: CreateProfileDto, user: User) {
    const profile = this.profileRepository.create({
      ...createProfileDto,
      user: user,
      userId: user.id,
    });

    return await this.profileRepository.save(profile);
  }

  async findOneById(id: string) {
    const profile = await this.profileRepository.findOne({
      where: { id }, // 补上这个,否则 avatar/resume 都会是 null
    });

    if (!profile) {
      throw new NotFoundException('Profile not found!');
    }

    return profile;
  }

  async findOneProfileBySlug(slug: string) {
    const profile = await this.profileRepository.findOne({
      where: {
        slug: slug,
      },
      relations: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    const avatarFile = await this.fileManagerService.getCurrentFile(
      profile.id,
      FileOwnerType.PROFILE,
      FileCategory.AVATAR,
      false,
    );

    const { password, ...user } = profile.user;

    return {
      ...profile,
      avatarUrl: avatarFile?.secureUrl ?? null,
      user,
    };
  }

  async findOneByName(name: string) {
    const profile = await this.profileRepository.findOne({
      where: {
        user: {
          name,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    const avatarFile = await this.fileManagerService.getCurrentFile(
      profile.id,
      FileOwnerType.PROFILE,
      FileCategory.AVATAR,
      false,
    );

    let resumeFileUrl: string | null = null;

    const resumeFile = await this.fileManagerService.getCurrentFile(
      profile.id,
      FileOwnerType.PROFILE,
      FileCategory.RESUME,
      true,
    );

    if (resumeFile) {
      const result = await this.fileManagerService.getFileUrl(
        profile.id,
        FileOwnerType.PROFILE,
        FileCategory.RESUME,
        'download',
      );

      resumeFileUrl = result.url;
    }

    const { password, ...user } = profile.user;

    return {
      ...profile,
      avatarUrl: avatarFile?.secureUrl ?? null,
      resumeFileUrl,
      resumeFileName: resumeFile?.fileOriginalName ?? null,
      resumeFileSize: resumeFile?.fileSize ?? null,
      resumeUpdatedAt: resumeFile?.updatedAt ?? null,
      user,
    };
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const findProfileToUpdate = await this.findOneById(id);

    if (updateProfileDto.githubLink) {
      findProfileToUpdate.githubLink = updateProfileDto.githubLink;
    }

    if (updateProfileDto.linkedinLink) {
      findProfileToUpdate.linkedinLink = updateProfileDto.linkedinLink;
    }

    if (updateProfileDto.location) {
      findProfileToUpdate.location = updateProfileDto.location;
    }

    if (updateProfileDto.highestEducationLevel) {
      findProfileToUpdate.highestEducationLevel =
        updateProfileDto.highestEducationLevel;
    }

    if (updateProfileDto.bio) {
      findProfileToUpdate.bio = updateProfileDto.bio;
    }

    if (updateProfileDto.slug) {
      findProfileToUpdate.slug = updateProfileDto.slug;
    }

    return await this.profileRepository.save(findProfileToUpdate);
  }

  // ---------- Avatar ----------
  async updateAvatar(profileId: string, file: Express.Multer.File) {
    // Make sure profile exists
    await this.findOneById(profileId);

    const saved = await this.fileManagerService.replaceFile(
      profileId,
      FileOwnerType.PROFILE,
      FileCategory.AVATAR,
      FileResourceType.IMAGE,
      'avatars',
      file,
      false,
    );

    return {
      data: {
        avatarUrl: saved.secureUrl,
        avatarOriginalName: saved.fileOriginalName,
      },
      message: 'avatar updated',
    };
  }

  async removeAvatar(profileId: string) {
    await this.findOneById(profileId);

    await this.fileManagerService.removeFile(
      profileId,
      FileOwnerType.PROFILE,
      FileCategory.AVATAR,
    );

    return {
      message: 'avatar removed',
    };
  }

  // ---------- Resume ----------
  async updateResume(profileId: string, file: Express.Multer.File) {
    // Make sure profile exists
    await this.findOneById(profileId);

    const saved = await this.fileManagerService.replaceFile(
      profileId,
      FileOwnerType.PROFILE,
      FileCategory.RESUME,
      FileResourceType.RAW,
      'resumes',
      file,
      true,
    );

    return {
      data: {
        resumeOriginalName: saved.fileOriginalName,
      },
      message: 'resume updated',
    };
  }

  async removeResumeFile(profileId: string) {
    await this.findOneById(profileId);

    await this.fileManagerService.removeFile(
      profileId,
      FileOwnerType.PROFILE,
      FileCategory.RESUME,
    );

    return {
      message: 'resume removed',
    };
  }

  // ---------- Preview / Download,avatar 和 resume 通用一套逻辑 ----------
  async getFileUrl(
    profileId: string,
    category: FileCategory,
    mode: 'preview' | 'download',
  ) {
    await this.findOneById(profileId);

    return this.fileManagerService.getFileUrl(
      profileId,
      FileOwnerType.PROFILE,
      category,
      mode,
    );
  }

  async getUserProfileAvatarByUserId(userId: string) {
    const profile = await this.profileRepository.findOneBy({ userId: userId });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    const getUserAvatar = await this.fileManagerService.getCurrentFile(
      profile?.id,
      FileOwnerType.PROFILE,
      FileCategory.AVATAR,
      false,
    );

    return getUserAvatar?.secureUrl ?? null;
  }

  async getProfileBySlug(slug: string) {
    return await this.profileRepository.findOne({
      where: {
        slug,
      },
    });
  }
}
