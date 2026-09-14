import { Type } from "class-transformer";
import { IsString, MinLength, MaxLength, IsOptional, IsNumber } from "class-validator";


export class CreateCategoryDto {
  @IsString()
  @MinLength(1, { message: 'category title is required! ' })
  @MaxLength(50, { message: 'category title cannot more than 50 words!' })
  title!: string;

  @IsString({ message: "Icon must be string" })
  @IsOptional()
  icon?: string;

  @IsString({ message: "File is required" })
  @IsOptional()
  fileId?: string

  @IsString({ message: "Color must be string" })
  @IsOptional()
  color?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'sortOrder must be number' })
  @IsNumber()
  sortOrder!: number;
}
