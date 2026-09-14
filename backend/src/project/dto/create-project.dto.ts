import { Transform, Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(1, { message: 'Project title is required! ' })
  @MaxLength(50, {
    message: 'Project title cannot more than $constraint1 characters',
  })
  projectTitle!: string;

  @IsString()
  @MinLength(1, { message: 'Project description is required! ' })
  @MaxLength(200, {
    message:
      'Project description cannot be longer than $constraint1 characters',
  })
  projectDescription!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsArray()
  @IsString({ each: true })
  projectTechStack!: string[];

  @IsOptional()
  @IsUrl()
  projectLiveDemoUrl?: string;

  @IsOptional()
  @IsUrl()
  projectRepositoryUrl?: string;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublic!: boolean;

  @Type(() => Number)
  @IsNumber()
  sortOrder!: number;
}
