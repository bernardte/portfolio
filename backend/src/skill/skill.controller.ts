import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateCategoryDto } from './dto/create-skill-category.dto';
import { UpdateSkillCategoryDto } from './dto/update-skill-category.dto';
import { UpdateSkillItemDto } from './dto/update-skill-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Ownership } from '../common/decorators/ownership.decorator';
import { SkillCategory } from './entities/skill-categories.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreatSkillItemDto } from './dto/create-skill-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFilePipe } from '../common/pipes/file.pipe';
import { SkillCategoryMapper } from './mapper/skill-category.mapper';
import { FileCategory } from '../file-manager/entities/file.entity';
import { ReorderSkillCategoryDto } from './dto/reorder-skill-category.dto';
import { SkillItemMapper } from './mapper/skill-item.mapper';
import { SkillItem } from './entities/skill-item.entity';
import { ReorderSkillItemDto } from './dto/reorder-skill-item.dto';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  // ==========================================
  // 1. Skill Categories (技能分类路由)
  // ==========================================

  // GET /skills -> 获取当前用户的所有分类及技能项
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAllCategoryByUserId(@CurrentUser() user: User) {
    const categories = await this.skillService.findAllCategoryByUserId(user); // 👈 加上 return

    return SkillCategoryMapper.toResponseList(categories);
  }

  @Patch('/reorder')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async reorder(
    @Body() reorderSkillCategoryDto: ReorderSkillCategoryDto,
    @CurrentUser() user: User,
  ) {
    return await this.skillService.reorderCategory(
      user.id,
      reorderSkillCategoryDto.orderedIds,
    );
  }

  // POST /skills/categories -> 创建分类
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ) {
    const newCategory = await this.skillService.createCategory(
      createCategoryDto,
      user,
    );

    return SkillCategoryMapper.toResponse(newCategory);
  }

  @Post('icon/image')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('iconFile'))
  async createCategoryIcon(
    @Query('category')
    category: FileCategory.SKILL_CATEGORY_ICON | FileCategory.SKILL_ITEM_ICON,
    @UploadedFile(
      createFilePipe(
        2 * 1024 * 1024,
        ['image/jpeg', 'image/png', 'image/webp'],
        'Icon File',
        false,
      ),
    )
    iconFile: Express.Multer.File,
  ) {
    return await this.skillService.uploadSkillIcon(category, iconFile);
  }

  // PATCH /skills/categories/:categoryId -> 更新分类
  @Patch('categories/:categoryId')
  @HttpCode(HttpStatus.OK)
  @Ownership({ resourceEntity: SkillCategory, param: 'categoryId' })
  async updateCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() updateSkillCategory: UpdateSkillCategoryDto,
  ) {
    return await this.skillService.updateCategory(
      categoryId,
      updateSkillCategory,
    );
  }

  // DELETE /skills/categories/:categoryId -> 删除分类
  @Delete('categories/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Ownership({ resourceEntity: SkillCategory, param: 'categoryId' })
  async removeCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @CurrentUser() user: User,
  ) {
    return await this.skillService.removeCategory(categoryId, user);
  }

  // ==========================================
  // 2. Skill Items (具体技能项路由)
  // ==========================================

  @Patch('/reorder/item')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async reorderSkillItem(
    @Body() skillItemReorderDto: ReorderSkillItemDto,
    @CurrentUser() user: User,
  ) {
    return await this.skillService.reorderSkillItem(
      skillItemReorderDto.sourceCategoryId,
      skillItemReorderDto.targetCategoryId,
      skillItemReorderDto.orderedIds,
      user,
    );
  }

  // POST /skills/categories/:categoryId/items -> 在特定分类下添加技能
  @Post('categories/:categoryId/items')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createSkillItem(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() creatSkillItemDto: CreatSkillItemDto,
  ) {
    const skillItem = await this.skillService.createSkillItem(
      creatSkillItemDto,
      categoryId,
    );

    return SkillItemMapper.toResponse(skillItem);
  }

  // PATCH /skills/items/:skillItemId -> 更新具体的技能项
  @Patch('items/:skillItemId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateSkillItem(
    @Param('skillItemId', ParseUUIDPipe) skillItemId: string,
    @Body() updateSkillItemDto: UpdateSkillItemDto,
    @CurrentUser() user: User,
  ) {
    return await this.skillService.updateSkillItem(
      skillItemId,
      user,
      updateSkillItemDto,
    );
  }

  // DELETE /skills/items/:skillItemId -> 删除具体的技能项
  @Delete('items/:skillItemId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSkillItem(
    @Param('skillItemId', ParseUUIDPipe) skillItemId: string,
    @CurrentUser() user: User,
  ) {
    return await this.skillService.removeSkillItem(skillItemId, user);
  }
}
