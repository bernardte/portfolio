import {
  PortfolioRawData,
  PortfolioResponse,
} from '../interface/portfolio.interface';

export class PortfolioMapper {
  static toResponse(portfolio: PortfolioRawData): PortfolioResponse {
    const {
      profile,
      projects = [],
      skillCategories = [],
      strengths = [],
    } = portfolio;
    
    return {
      profile: {
        id: profile.id,
        avatarUrl: profile.avatarUrl,
        highestEducationLevel: profile.highestEducationLevel,
        location: profile.location,
        slug: profile.slug,
        linkedinLink: profile.linkedinLink,
        bio: profile.bio,
        githubLink: profile.githubLink,
        name: profile.user.name,
        email: profile.user.email,
      },

      projects: projects.map((project) => ({
        id: project.id,
        projectTitle: project.projectTitle,
        projectThumbnailImage: project.projectThumbnailImage,
        projectDescription: project.projectDescription,
        projectTechStack: project.projectTechStack,
        projectLiveDemoUrl: project.projectLiveDemoUrl,
        projectRepositoryUrl: project.projectRepositoryUrl,
        sortOrder: project.sortOrder,
        isPublic: project.isPublic,
      })),

      skillCategories: skillCategories.map((category) => ({
        id: category.id,
        title: category.title,
        icon: category.icon,
        color: category.color,
        sortOrder: category.sortOrder,

        items: Array.isArray(category.items)
          ? category.items.map((item) => ({
              id: item.id,
              title: item.title,
              icon: item.icon,
              color: item.color,
              sortOrder: item.sortOrder,
            }))
          : [],
      })),

      strengths: strengths.map((strength) => ({
        id: strength.id,
        title: strength.title,
        description: strength.description,
        icon: strength.icon,
        color: strength.color,
        sortOrder: strength.sortOrder,
      })),
    };
  }
}
