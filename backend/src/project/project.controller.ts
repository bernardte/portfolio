import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ReorderProjectDto } from './dto/reorder-project.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Project } from './entities/project.entity';
import { Ownership } from '../common/decorators/ownership.decorator';
import { createFilePipe } from '../common/pipes/file.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectMapper } from './mapper/project.mapper';
import { UpdateProjectVisibilityDto } from './dto/update-project-visibility.dto';
import { User } from '../auth/entities/user.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('projectThumbnailImage'))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile(
      createFilePipe(
        5 * 1024 * 1024,
        ['image/jpeg', 'image/png'],
        'Thumbnail Image',
        true,
      ),
    )
    projectThumbnailImage: Express.Multer.File,
    @CurrentUser() user,
  ) {
    const project = await this.projectService.create(
      createProjectDto,
      user,
      projectThumbnailImage,
    );

    return ProjectMapper.toResponse(project);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user) {
    const projects = await this.projectService.findAll(user.id);

    return projects.map((project) => ProjectMapper.toResponse(project));
  }

  @Patch('reorder')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async reorder(
    @Body() reorderProjectDto: ReorderProjectDto,
    @CurrentUser() user,
  ) {
    const projects = await this.projectService.reorder(
      user.id,
      reorderProjectDto.orderedIds,
    );

    return projects.map((project) => ProjectMapper.toResponse(project));
  }

  @Patch(':id/visibility')
  @Ownership({ resourceEntity: Project, param: 'id' })
  @HttpCode(HttpStatus.OK)
  async updateVisibility(
    @Param("id") id: string,
    @Body() updateProjectVisibilityDto: UpdateProjectVisibilityDto,
  ) {
    const updateProject = await this.projectService.updateVisibility(
      id,
      updateProjectVisibilityDto,
    );

    return ProjectMapper.toResponse(updateProject);
  }

  @Patch(':id')
  @Ownership({ resourceEntity: Project, param: 'id' })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('projectThumbnailImage'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile(
      createFilePipe(
        5 * 1024 * 1024,
        ['image/jpeg', 'image/png'],
        'Thumbnail Image',
        false,
      ),
    )
    projectThumbnailImage: Express.Multer.File,
  ) {
    const updatedProject = await this.projectService.update(
      id,
      updateProjectDto,
      projectThumbnailImage,
    );
    return ProjectMapper.toResponse(updatedProject);
  }

  @Delete(':id')
  @Ownership({ resourceEntity: Project, param: 'id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return await this.projectService.remove(id, user);
  }
}
