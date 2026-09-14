import { title } from 'process';
import { SkillItem } from '../entities/skill-item.entity';

export class SkillItemMapper {
  static toResponse(skillItem: SkillItem) {
    return {
      categoryId: skillItem.categoryId,
      id: skillItem.id,
      icon: skillItem.icon,
      title: skillItem.title,
      color: skillItem.color,
      sortOrder: skillItem.sortOrder,
      createdAt: skillItem.createdAt,
    };
  }
}
