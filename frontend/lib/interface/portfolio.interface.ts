export interface ProjectResponse {
    id: string;
    projectTitle: string;
    projectThumbnailImage: string | null;
    projectDescription: string;
    projectTechStack: string[];
    projectLiveDemoUrl?: string;
    projectRepositoryUrl?: string;
    isPublic: boolean;
    sortOrder: number;
}

export interface SkillItemResponse {
  id: string;
  title: string;
  icon?: string;
  color?: string;
  sortOrder: number;
}

export interface SkillCategoriesResponse {
  id: string;
  title: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  items: SkillItemResponse[];
}

export interface StrengthResponse {
  id: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  sortOrder: number;
}

export interface ProfileResponse {
  id: string;
  avatarUrl: string | null;
  slug?: string;
  highestEducationLevel?: string;
  location?: string;
  linkedinLink?: string;
  bio?: string;
  githubLink?: string;
  name: string;
  email: string;
}


export interface PortfolioDataResponse {
  profile: ProfileResponse;
  projects: ProjectResponse[];
  skillCategories: SkillCategoriesResponse[];
  strengths: StrengthResponse[];
}