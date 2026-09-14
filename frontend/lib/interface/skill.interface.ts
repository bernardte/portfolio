export interface BaseSkillCategory {
  title: string;
  icon: string | File;
  color: string;
  sortOrder: number;
  items: SkillItemResponse[];
}

export type CreateSkillCategory = Omit<BaseSkillCategory, "items"> & {
  fileId?: string;
};

export type SkillCategoryResponse = Omit<BaseSkillCategory, "icon"> & {
  id: string;
  icon: string;
};

export type UpdateSkillCategory = Partial<CreateSkillCategory>;

export interface BaseSkillItem {
  title: string;
  icon: string | File | null;
  sortOrder: number;
  color: string | null;
  categoryId: SkillCategoryResponse["id"];
}

export type CreateSkillItem = BaseSkillItem & {
  fileId: string;
};

export type UpdateSkillItem = Partial<CreateSkillItem>;

export type SkillItemResponse = Omit<BaseSkillItem, "icon"> & {
  id: string;
  icon: string;
}
