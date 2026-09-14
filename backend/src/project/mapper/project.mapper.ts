import type { Project } from '../entities/project.entity';

type ProjectResponseData = Project & {
  projectThumbnailImage: string | null
}

export class ProjectMapper {
  static toResponse(project: ProjectResponseData) {
    return {
      id: project.id,
      projectTitle: project.projectTitle,
      projectDescription: project.projectDescription,
      projectTechStack: project.projectTechStack,
      projectLiveDemoUrl: project.projectLiveDemoUrl,
      projectThumbnailImage: project.projectThumbnailImage,
      projectRepositoryUrl: project.projectRepositoryUrl ?? null,
      isPublic: project.isPublic,
      sortOrder: project.sortOrder,
    };
  }
}
