import { IsString, MinLength, MaxLength, IsOptional, IsNumber, IsUUID } from "class-validator";

export class CreatSkillItemDto {
  @IsString()
  @MinLength(1, { message: 'Skill title is required!' })
  @MaxLength(50, { message: 'Skill title cannot exceed 50 characters!' })
  title!: string;

  @IsString()
  icon!: string; // 技能图标（SVG/PNG 图片链接）

  @IsString()
  @IsOptional()
  color?: string; // 技能图标（SVG/PNG 图片链接）

  @IsNumber()
  @IsOptional()
  sortOrder!: number;

  // 如果路由参数里没有 categoryId (比如 POST /skills/items)，则需要在 DTO 中传递
  // 如果路由是 POST /skills/categories/:categoryId/items，则此处可以省略
  @IsUUID('4', { message: 'Invalid category ID format' })
  categoryId!: string;

  @IsString()
  @IsOptional()
  fileId?: string;
}