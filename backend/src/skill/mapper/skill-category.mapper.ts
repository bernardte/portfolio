import { SkillCategory } from '../entities/skill-categories.entity';
import { SkillItemMapper } from './skill-item.mapper';

export class SkillCategoryMapper {
  static toResponse(category: SkillCategory) {
    return {
      id: category.id,
      title: category.title,
      color: category.color,
      sortOrder: category.sortOrder,
      icon: category.icon,
      createdAt: category.createdAt,
      items:
        category.items?.map((item) => SkillItemMapper.toResponse(item)) ?? [],
    };
  }

  static toResponseList(categories: SkillCategory[]) {
    return categories.map((category) => this.toResponse(category));
  }
}
