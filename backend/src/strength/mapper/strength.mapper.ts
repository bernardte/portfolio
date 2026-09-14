import { Strength } from '../entities/strength.entity';

export class StrengthMapper {
  static toResponse(strength: Strength) {
    return {
      id: strength.id,
      title: strength.title,
      description: strength.description,
      icon: strength.icon,
      color: strength.color,
      sortOrder: strength.sortOrder,
      profileId: strength.profileId,
      createdAt: strength.createdAt,
      updatedAt: strength.updatedAt,
    };
  }

  static toResponseList(strengths: Strength[]) {
    return strengths.map((strength) => this.toResponse(strength));
  }
}
