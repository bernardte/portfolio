// --- 1. 基础子实体接口拆分 (DTO/Response 规范) ---

export interface ProfileResponse {
  id: string;
  avatarUrl: string | null;
  highestEducationLevel?: string;
  location?: string;
  linkedinLink?: string;
  bio?: string;
  slug?: string;
  githubLink?: string;
  name: string;
  email: string;
}

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

export interface SkillCategoryResponse {
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
  color?: string
  sortOrder: number;
}

// --- 2. 最终返回给客户端的 API 聚合类型 ---

export interface PortfolioResponse {
  profile: ProfileResponse;
  projects: ProjectResponse[];
  skillCategories: SkillCategoryResponse[];
  strengths: StrengthResponse[];
}

// --- 3. Mapper 输入数据源类型 (来自 Service/DB 聚合层) ---

export interface PortfolioRawData {
  profile: {
    id: string;
    avatarUrl: string | null;
    highestEducationLevel?: string;
    location?: string;
    linkedinLink?: string;
    slug?: string
    bio?: string;
    githubLink?: string;
    user: {
      name: string;
      email: string;
    };
  };
  projects: ProjectResponse[];
  skillCategories: SkillCategoryResponse[];
  strengths: StrengthResponse[];
}
