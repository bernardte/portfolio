import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class ReorderSkillItemDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  orderedIds!: string[];

  @IsUUID('4')
  @IsNotEmpty()
  targetCategoryId!: string;

  @IsUUID('4')
  @IsNotEmpty()
  sourceCategoryId!: string;
}
