import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateStrengthDto {
  @IsString()
  @MinLength(1, { message: 'title is required!' })
  title!: string;

  @IsString()
  @MinLength(1, { message: 'Description is required!' })
  description!: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Icon is required!' })
  icon?: string;

  @IsOptional()
  @IsUUID(4)
  fileId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Color is required!' })
  color?: string;

  @IsNumber()
  sortOrder!: number;
}
