import { Profile } from '../entities/profile.entity';
import { User } from '../../auth/entities/user.entity';

type ProfileResponse = Omit<Profile, 'user'> & {
  user: Omit<User, 'password'>;
  avatarUrl?: string | null;
  resumeFileUrl?: string | null;
  resumeFileName?: string | null;
  resumeFileSize?: number | null;
  resumeUpdatedAt?: Date | null;
};

export class ProfileMapper {
  static toResponse(profile: ProfileResponse) {
    return {
      id: profile.id,
      slug: profile.slug,
      highestEducationLevel: profile.highestEducationLevel,
      location: profile.location,
      linkedinLink: profile.linkedinLink,
      githubLink: profile.githubLink,
      bio: profile.bio,
      user: profile.user,

      // avatar 是公开资源,直接给完整 URL,前端可以直接 <Image src={avatarUrl} />
      avatarUrl: profile.avatarUrl ?? null,

      // resume 是私有资源,不返回永久 URL,只告诉前端"有没有"和"文件名"
      // 前端要预览/下载时,另外调 GET /profile/:id/resume/url?mode=preview|download 现拿签名链接
      hasResume: !!profile.resumeFileUrl,
      resumeFileUrl: profile.resumeFileUrl,
      resumeFileName: profile.resumeFileName,
      resumeFileSize: profile.resumeFileSize,
      resumeUpdatedAt: profile.resumeUpdatedAt,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  static toSummaryResponse(metrics: {
    completionPercentage: number;
    projectsCount: number;
    skillsCount: number;
    strengthsCount: number;
  }) {
    return {
      completionPercentage: metrics.completionPercentage,
      projectsCount: metrics.projectsCount,
      skillsCount: metrics.skillsCount,
      strengthsCount: metrics.strengthsCount,
    };
  }
}
