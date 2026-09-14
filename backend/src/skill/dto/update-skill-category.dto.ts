import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-skill-category.dto';

export class UpdateSkillCategoryDto extends PartialType(CreateCategoryDto) {}
