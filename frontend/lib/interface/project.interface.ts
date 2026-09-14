// 1. 基础公共字段（纯数据字段，不含 ID 和 图片）
export interface BaseProjectData {
  projectTitle: string;
  projectDescription: string;
  projectTechStack: string[];
  projectLiveDemoUrl: string;
  projectRepositoryUrl: string;
  isPublic: boolean;
  sortOrder: number;
}

// 2. 后端 API 返回的标准项目实体（例如 GET /api/projects 的返回值）
export interface ProjectsResponseData extends BaseProjectData {
  id: string;
  projectThumbnailImage: string; // 后端返回的是 CDN / Cloudinary / S3 图片链接
}

// 3. 表单初始值类型 (用于 Edit Project Form 的 InitialValues)
// 直接复用 ProjectsResponseData 或 Partial<ProjectsResponseData> 即可，无需重复定义
export type ProjectFormInitialValues = Partial<ProjectsResponseData>;

// 4. API 请求 payload (用于 POST / PUT / PATCH 请求)
// 创建请求：继承 Base，图片为 File 或 null
export interface ProjectCreateRequestData extends Omit<
  BaseProjectData,
  "projectLiveDemoUrl" | "projectRepositoryUrl"
> {
  projectLiveDemoUrl?: string;
  projectRepositoryUrl?: string;
  projectThumbnailImage: File | null;
}

// 更新请求：所有字段皆可选（Partial），但必须包含 id，图片可以是新上传的 File、null 或不传
export type ProjectUpdateRequestData = Partial<ProjectCreateRequestData> 

