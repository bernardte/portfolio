import { Transform } from 'class-transformer';
import {
  IsUrl,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateProfileDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsString()
  @MinLength(3, {
    message: 'Slug must be at least $constraint1 characters long',
  })
  @MaxLength(50, {
    message: 'Slug cannot exceed $constraint1 characters',
  })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and single hyphens',
  })
  slug!: string;

  @IsString()
  @MinLength(3, {
    message: 'Name must be at least $constraint1 characters long',
  })
  @MaxLength(50, { message: 'Name cannot exceed than $constraint1 characters' })
  highestEducationLevel!: string;

  @MinLength(3, {
    message: 'Bio must be at least $constraint1 characters long',
  })
  @MaxLength(500, { message: 'Bio cannot exceed than $constraint1 characters' })
  bio!: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  location!: string;

  @IsUrl()
  @IsOptional()
  linkedinLink?: string;

  @IsUrl()
  @IsOptional()
  githubLink?: string;
}
