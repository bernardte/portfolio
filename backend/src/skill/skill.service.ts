import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-skill-category.dto';
import { CreatSkillItemDto } from './dto/create-skill-item.dto';
import { UpdateSkillCategoryDto } from './dto/update-skill-category.dto';
import { UpdateSkillItemDto } from './dto/update-skill-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { SkillCategory } from './entities/skill-categories.entity';
import { SkillItem } from './entities/skill-item.entity';
import { User } from '../auth/entities/user.entity';
import { FileManagerService } from '../file-manager/file-manager.service';
import {
  FileCategory,
  FileOwnerType,
  FileResourceType,
} from '../file-manager/entities/file.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillCategory)
    private readonly skillCategoryRepository: Repository<SkillCategory>,
    @InjectRepository(SkillItem)
    private readonly skillItemRepository: Repository<SkillItem>,
    private readonly fileManagerService: FileManagerService,
    private readonly dataSource: DataSource,
  ) {}

  async uploadSkillIcon(
    category: FileCategory.SKILL_CATEGORY_ICON | FileCategory.SKILL_ITEM_ICON,
    file: Express.Multer.File,
  ) {
    const folderName =
      category === FileCategory.SKILL_CATEGORY_ICON
        ? 'skill category icon'
        : 'skill item icon';

    const result = await this.fileManagerService.uploadFile(
      category,
      FileResourceType.IMAGE,
      folderName,
      file,
      false,
    );

    const { secureUrl, id } = result;

    return {
      fileId: id,
      icon: secureUrl,
    };
  }

  async findAllCategoryByUserId(user: User) {
    const categories = await this.skillCategoryRepository.find({
      where: { userId: user.id },
      relations: { items: true },
      order: {
        sortOrder: 'ASC', // 分类本身按序号正序
        items: {
          sortOrder: 'ASC', // 分类下的技能子项也按序号正序（可选）
        },
      },
    });

    return categories;
  }

  async createCategory(createCategoryDto: CreateCategoryDto, user: User) {
    const { fileId, ...categoryData } = createCategoryDto;

    return this.dataSource.transaction(async (manager) => {
      // 先把已有分类整体 +1，让出 sortOrder = 0 的位置
      await manager
        .createQueryBuilder()
        .update(SkillCategory)
        .set({ sortOrder: () => '"sortOrder" + 1' })
        .where('userId = :userId', { userId: user.id })
        .execute();

      const newCategory = manager.create(SkillCategory, {
        ...categoryData,
        sortOrder: 0, // 显式指定
        user,
      });
      await manager.save(newCategory);

      if (fileId) {
        await this.fileManagerService.attachFile(
          fileId,
          newCategory.id,
          FileOwnerType.SKILL_CATEGORY,
          manager,
        );
      }

      return newCategory;
    });
  }

  async createSkillItem(
    createskillItemDto: CreatSkillItemDto,
    categoryId: string,
  ) {
    const { fileId, ...skillItem } = createskillItemDto;
    const category = await this.findOneCategory(categoryId);

    return await this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(SkillItem)
        .set({ sortOrder: () => '"sortOrder" + 1' })
        .where('categoryId = :categoryId', { categoryId: categoryId })
        .execute();

      const newSkillIttem = manager.create(SkillItem, {
        ...createskillItemDto,
        sortOrder: 0,
        categoryId: categoryId,
        category: category,
      });

      await manager.save(newSkillIttem);

      if (fileId) {
        await this.fileManagerService.attachFile(
          fileId,
          categoryId,
          FileOwnerType.SKILL_ITEM,
          manager,
        );
      }

      return newSkillIttem;
    });
  }

  // find all skill items
  async findAllSkillsItemsByCategoryId(categoryId: string, user: User) {
    const category = await this.findOneCategory(categoryId);

    if (category?.userId !== user.id)
      throw new UnauthorizedException(
        'You only allow to find your own skill items',
      );

    const skillItem = await this.skillItemRepository.findBy({ categoryId });

    if (skillItem.length === 0) return skillItem;

    return skillItem;
  }

  async findAllSkills(userId: string) {
    const skillCategories = await this.skillCategoryRepository.find({
      where: { userId: userId },
      relations: { items: true },
      order: {
        sortOrder: 'ASC',
      },
    });

    if (skillCategories.length === 0) return skillCategories;
  }

  // find one category
  async findOneCategory(categoryId: string) {
    const category = await this.skillCategoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) throw new NotFoundException('Category not found!');

    return category;
  }

  async findOneSkillBySlug(slug: string) {
    const skills = await this.skillCategoryRepository.find({
      where: {
        user: {
          profile: {
            slug: slug,
          },
        },
      },

      relations: { items: true },
      order: {
        sortOrder: "ASC",
        items: {
          sortOrder: "ASC"
        }
      }
    });

    if(skills.length === 0){
      return skills;
    }

    return skills;
  }

  async findSkillByName(name: string) {
    const skillCategories = await this.skillCategoryRepository.find({
      where: {
        user: {
          name: name,
        },
      },
      relations: { items: true },
      order: {
        sortOrder: 'ASC',
        items: {
          sortOrder: 'ASC',
        },
      },
    });

    if (skillCategories.length === 0) {
      return skillCategories;
    }

    return skillCategories;
  }

  async findOneSkills(skillItemId: string, user: User) {
    const skillItem = await this.skillItemRepository.findOne({
      where: {
        id: skillItemId,
      },
      relations: { category: true },
    });

    if (!skillItem) {
      throw new NotFoundException('skill items not found!');
    }

    if (skillItem.category.userId !== user.id)
      throw new UnauthorizedException(
        'You are only allowed to access your own skill items',
      );

    return skillItem;
  }

  async updateCategory(
    categoryId: string,
    updateSkillCategoryDto: UpdateSkillCategoryDto,
  ) {
    await this.findOneCategory(categoryId);

    if (updateSkillCategoryDto.fileId) {
      await this.fileManagerService.replaceAttachFile(
        updateSkillCategoryDto.fileId,
        categoryId,
        FileOwnerType.SKILL_CATEGORY,
        FileCategory.SKILL_CATEGORY_ICON,
      );
    }

    await this.skillCategoryRepository.update(categoryId, {
      title: updateSkillCategoryDto.title,
      color: updateSkillCategoryDto.color,
      icon: updateSkillCategoryDto.icon,
    });

    return await this.skillCategoryRepository.findOne({
      where: { id: categoryId },
    });
  }

  async updateSkillItem(
    skillItemId: string,
    user: User,
    updateSkillItemDto: UpdateSkillItemDto,
  ) {
    const skillItem = await this.findOneSkills(skillItemId, user);

    if (updateSkillItemDto.fileId) {
      await this.fileManagerService.replaceAttachFile(
        updateSkillItemDto.fileId,
        skillItemId,
        FileOwnerType.SKILL_ITEM,
        FileCategory.SKILL_ITEM_ICON,
      );
    }

    if (updateSkillItemDto.color !== undefined) {
      skillItem.color = updateSkillItemDto.color;
    }

    if (updateSkillItemDto.icon !== undefined) {
      skillItem.icon = updateSkillItemDto.icon;
    }

    if (updateSkillItemDto.title !== undefined) {
      skillItem.title = updateSkillItemDto.title;
    }

    return await this.skillItemRepository.save(skillItem);
  }

  async removeCategory(categoryId: string, user: User) {
    await this.dataSource.transaction(async (manager) => {
      // 1. 先锁住当前用户的所有 Category
      const categories = await manager.find(SkillCategory, {
        where: {
          userId: user.id,
        },
        order: {
          sortOrder: 'ASC',
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (categories.length === 0) {
        return categories;
      }

      // 2. 找出要删除的 Category
      const category = categories.find(
        (category) => category.id === categoryId,
      );

      if (!category) {
        throw new NotFoundException('Category not found!');
      }

      // 3. 删除后重新计算 sortOrder
      const remainingCategories = categories
        .filter((category) => category.id !== categoryId)
        .map((category, index) => {
          category.sortOrder = index;

          return category;
        });

      // 4. 删除 Category
      // SkillItem 会因为 ON DELETE CASCADE 一起删除
      await manager.remove(SkillCategory, category);

      // 5. 保存新的 sortOrder
      await manager.save(SkillCategory, remainingCategories);

      return remainingCategories;
    });

    const fileFounded = await this.fileManagerService.getCurrentFile(
      categoryId,
      FileOwnerType.SKILL_CATEGORY,
      FileCategory.SKILL_CATEGORY_ICON,
      false,
    );

    if (fileFounded?.id) {
      await this.fileManagerService.removeFile(
        categoryId,
        FileOwnerType.SKILL_CATEGORY,
        FileCategory.SKILL_CATEGORY_ICON,
      );
    }

    return;
  }

  async removeSkillItem(skillItemId: string, user: User) {
    await this.findOneSkills(skillItemId, user);

    await this.dataSource.transaction(async (manager) => {
      const skillItems = await manager.find(SkillItem, {
        where: {
          id: skillItemId,
        },
        order: {
          sortOrder: 'ASC',
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (skillItems.length === 0) {
        return skillItems;
      }

      const skillItem = skillItems.find((item) => item.id === skillItemId);

      const remainingSkillItem = skillItems
        .filter((item) => item.id !== skillItemId)
        .map((skillItem, index) => {
          skillItem.sortOrder = index;

          return skillItem;
        });

      await manager.remove(SkillItem, skillItem);

      await manager.save(SkillItem, remainingSkillItem);

      return remainingSkillItem;
    });

    const fileFounded = await this.fileManagerService.getCurrentFile(
      skillItemId,
      FileOwnerType.SKILL_ITEM,
      FileCategory.SKILL_ITEM_ICON,
      false,
    );

    if (fileFounded?.id) {
      await this.fileManagerService.removeFile(
        skillItemId,
        FileOwnerType.SKILL_ITEM,
        FileCategory.SKILL_ITEM_ICON,
      );
    }

    return;
  }

  async reorderCategory(userId: string, orderedIds: string[]) {
    return await this.dataSource.transaction(async (manager) => {
      // 1. 锁定该用户当前所有分类，防止并发拖拽互相踩踏
      const categories = await manager.find(SkillCategory, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (categories.length === 0) {
        return categories;
      }

      //2.  校验：前端传来的 id 集合必须跟数据库现有的完全一致
      const existingIds = categories.map((c) => c.id).sort();
      const incomingIds = [...orderedIds].sort();

      const lengthMatch = existingIds.length === incomingIds.length;
      const checkIdsMatch = existingIds.every(
        (id, index) => id === incomingIds[index],
      );

      const isExacMatch = lengthMatch && checkIdsMatch;

      if (!isExacMatch)
        throw new BadRequestException(
          'orderedIds must exactly match your existing categories',
        );

      // 3. 一条 SQL 原子地批量更新 sortOrder（PostgreSQL 写法）
      await manager.query(
        `
      UPDATE skill_categories
      SET "sortOrder" = data.new_order
      FROM (
        SELECT
          unnest($1::uuid[]) AS id,
          unnest($2::int[])  AS new_order
      ) AS data
      WHERE skill_categories.id = data.id
        AND skill_categories."userId" = $3
      `,
        [orderedIds, orderedIds.map((_, index) => index), userId],
      );

      return manager.find(SkillCategory, {
        where: { userId: userId },
        order: { sortOrder: 'ASC' },
      });
    });
  }

  async reorderSkillItem(
    sourceCategoryId: string,
    targetCategoryId: string,
    orderedIds: string[],
    user: User,
  ) {
    // 我拿category里的一个item 放到另外一个category的item（这里顺序可能不一样， 不一定放在第一个和第二个，可能在item之间）
    // 有什么可能会用到的Array method findIndex, find
    // 我要知道他在跟哪一个category交换（我要拿到两个categoryId） -> filter 两个category
    // skillItem
    console.log('orderedIds: ', orderedIds);
    console.log('targetCategoryId: ', targetCategoryId);
    console.log('sourceCategoryId: ', sourceCategoryId);

    return await this.dataSource.transaction(async (manager) => {
      // 1. filter 出来source category和target category
      const categories = await manager.find(SkillCategory, {
        where: [
          {
            id: sourceCategoryId,
            userId: user.id,
          },
          {
            id: targetCategoryId,
            userId: user.id,
          },
        ],
        relations: {
          items: true,
        },
      });

      if (categories.length === 0) {
        throw new NotFoundException('No categories found for this user');
      }

      // 2.找出对应的category
      const targetCategory = categories.find(
        (category) => category.id === targetCategoryId,
      );
      const sourceCategory = categories.find(
        (category) => category.id === sourceCategoryId,
      );

      if (!targetCategory) {
        throw new NotFoundException('Target category not found!');
      }

      if (!sourceCategory) {
        throw new NotFoundException('Source category not found!');
      }

      // 判断是不是在同一个category排序
      if (sourceCategoryId === targetCategoryId) {
        orderedIds.forEach((id, index) => {
          //  find specific item
          // 判断这个在
          const item = sourceCategory.items.find(
            (itemSequence) => itemSequence.id === id,
          );

          if (item) {
            // overwrite order
            item.sortOrder = index;
          }
        });

        await manager.save(SkillItem, sourceCategory.items);

        return;
      }

      // 判断是不是跨category 排序
      // 找出被移动的Item
      const moveItem = sourceCategory.items.find((item) =>
        orderedIds.includes(item.id),
      );

      if (!moveItem) {
        throw new NotFoundException('Target item not found!');
      }

      // 修改category Id 和 category
      moveItem.categoryId = targetCategory.id;
      moveItem.category = targetCategory;

      // 重新排序source category
      const newSourceCategoryItems = sourceCategory.items.filter(
        (item) => item.id !== moveItem.id,
      );

      newSourceCategoryItems.forEach((item, index) => {
        item.sortOrder = index;
      });

      // 5. 根据 orderedIds 建立 Target 的新顺序
      const newTargetCategoryItems = orderedIds
        .map((id) => {
          // 如果是移动进来的 item
          if (id === moveItem.id) {
            return moveItem;
          }

          // 否则从原本 target category 找
          return targetCategory.items.find((item) => item.id === id);
        })
        .filter((item): item is SkillItem => item !== undefined);

      // 6. Target Category 重新排序
      newTargetCategoryItems.forEach((item, index) => {
        item.sortOrder = index;
      });

      // 7. 保存
      return await manager.save(SkillItem, [
        ...newSourceCategoryItems,
        ...newTargetCategoryItems,
      ]);
    });
  }
}
