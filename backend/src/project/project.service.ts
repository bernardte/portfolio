import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { In, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { FileManagerService } from '../file-manager/file-manager.service';
import {
  FileCategory,
  FileOwnerType,
  FileResourceType,
} from '../file-manager/entities/file.entity';
import { DataSource } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { UpdateProjectVisibilityDto } from './dto/update-project-visibility.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly fileManagerService: FileManagerService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: User,
    thumbnail: Express.Multer.File,
  ) {
    if (!thumbnail) {
      throw new BadRequestException('Thumbnail image is required');
    }

    const { sortOrder: targetPosition, ...restDto } = createProjectDto;

    const savedProject = await this.dataSource.transaction(async (manager) => {
      // 1. 锁住当前用户的所有项目,防止并发插入时顺移逻辑互相踩踏
      //    (Postgres 下用 pessimistic_write 会在事务内加行锁)
      const userProject = await manager.find(Project, {
        where: { userId: user.id },
        order: { sortOrder: 'ASC' },
        lock: { mode: 'pessimistic_write' },
      });

      // 2. clamp 一下,防止前端传来的 targetPosition 越界(比如负数或超出长度)
      const position = Math.max(
        0,
        Math.min(targetPosition ?? userProject.length, userProject.length),
      );

      // 3. 把 position 及之后的项目全部 sortOrder + 1,腾出位置
      const toShift = userProject.filter(
        (project) => project.sortOrder > position,
      );
      await Promise.all(
        toShift.map((p) =>
          manager.update(Project, { id: p.id }, { sortOrder: p.sortOrder + 1 }),
        ),
      );

      // 4. 插入新项目,占用刚腾出来的 position
      const project = manager.create(Project, {
        ...restDto,
        sortOrder: position,
        userId: user.id,
        user,
      });

      return manager.save(project);
    });

    await this.fileManagerService.replaceFile(
      savedProject.id,
      FileOwnerType.PROJECT,
      FileCategory.PROJECT_IMAGE,
      FileResourceType.IMAGE,
      'Project Thumbnail',
      thumbnail,
      false, // project is public, so thumbnail is public
    );

    const currentFile = await this.fileManagerService.getCurrentFile(
      savedProject.id,
      FileOwnerType.PROJECT,
      FileCategory.PROJECT_IMAGE,
      false,
    );

    return {
      ...savedProject,
      projectThumbnailImage: currentFile?.secureUrl ?? null,
    };
  }

  async findOne(projectId: string) {
    const project = await this.projectRepository.findOneBy({ id: projectId });

    if (!project) throw new NotFoundException('Project not found!');

    const findProjectFile = await this.fileManagerService.getCurrentFile(
      project.id,
      FileOwnerType.PROJECT,
      FileCategory.PROJECT_IMAGE,
      false,
    );

    return {
      ...project,
      projectThumbnailImage: findProjectFile?.secureUrl ?? null,
    };
  }

  async findOneProjectBySlug(slug: string) {
    const projects = await this.projectRepository.find({
      where: {
        user: {
          profile: {
            slug: slug,
          },
        },
      },

      order: {
        sortOrder: "ASC",
      }
    });

    if (projects.length === 0) {
      return [];
    }

    const promiseProjects = projects.map(async (project) => {
      const projectThumbnailImage = await this.fileManagerService.getCurrentFile(
        project.id,
        FileOwnerType.PROJECT,
        FileCategory.PROJECT_IMAGE,
        false,
      );

      return {
        id: project.id,
        projectTitle: project.projectTitle,
        projectThumbnailImage: projectThumbnailImage?.secureUrl ?? null,
        projectDescription: project.projectDescription,
        projectTechStack: project.projectTechStack,
        projectLiveDemoUrl: project.projectLiveDemoUrl ?? undefined,
        projectRepositoryUrl: project.projectRepositoryUrl ?? undefined,
        isPublic: project.isPublic,
        sortOrder: project.sortOrder,
      };
    });

    return Promise.all(promiseProjects);
  }

  async findOneByName(name: string) {
    const projects = await this.projectRepository.find({
      where: {
        user: {
          name,
        },
      },
    });

    if (projects.length === 0) {
      return [];
    }

    const promiseProjects = projects.map(async (project) => {
      const projectThumbnailImage =
        await this.fileManagerService.getCurrentFile(
          project.id,
          FileOwnerType.PROJECT,
          FileCategory.PROJECT_IMAGE,
          false,
        );

      return {
        id: project.id,
        projectTitle: project.projectTitle,
        projectThumbnailImage: projectThumbnailImage?.secureUrl ?? null,
        projectDescription: project.projectDescription,
        projectTechStack: project.projectTechStack,
        projectLiveDemoUrl: project.projectLiveDemoUrl ?? undefined,
        projectRepositoryUrl: project.projectRepositoryUrl ?? undefined,
        isPublic: project.isPublic,
        sortOrder: project.sortOrder,
      };
    });

    return Promise.all(promiseProjects);
  }

  async findAll(userId: string) {
    const findUserProjects = await this.projectRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
      order: { sortOrder: 'ASC' },
    });

    const projectsWithImages = await Promise.all(
      findUserProjects.map(async (project) => {
        const imageFile = await this.fileManagerService.getCurrentFile(
          project.id, // Passes the single project ID string
          FileOwnerType.PROJECT, // Matches enum constraint
          FileCategory.PROJECT_IMAGE, // Matches enum constraint
          false, // isPrivate value
        );

        // 3. Return a clean object containing original project parameters + file payload
        return {
          ...project,
          projectThumbnailImage: imageFile?.secureUrl ?? null, // Attach file metadata object, or null if empty
        };
      }),
    );

    return projectsWithImages;
  }

  async updateVisibility(
    id: string,
    updateProjectVisibilityDto: UpdateProjectVisibilityDto,
  ) {
    const project = await this.findOne(id);

    project.isPublic = updateProjectVisibilityDto.isPublic;

    return this.projectRepository.save(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    thumbnailImageFile: Express.Multer.File,
  ) {
    const project = await this.findOne(id);

    if (thumbnailImageFile) {
      await this.fileManagerService.replaceFile(
        project.id,
        FileOwnerType.PROJECT,
        FileCategory.PROJECT_IMAGE,
        FileResourceType.IMAGE,
        'Project Thumbnail',
        thumbnailImageFile,
        false,
      );
    }

    Object.entries(updateProjectDto).forEach(([key, value]) => {
      if (value !== undefined) {
        project[key] = value;
      }
    });

    return await this.projectRepository.save(project);
  }

  async remove(id: string, user: User) {
    await this.dataSource.transaction(async (manager) => {
      const projectToDelete = await manager.findOne(Project, {
        where: {
          id,
          userId: user.id,
        },
      });

      if (!projectToDelete) {
        throw new NotFoundException('Project not found');
      }

      const projectsToShift = await manager.find(Project, {
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

      for (const project of projectsToShift) {
        if (project.sortOrder > projectToDelete.sortOrder) {
          project.sortOrder -= 1;
        }
      }

      await manager.save(Project, projectsToShift);

      await manager.remove(Project, projectToDelete);
    });

    await this.fileManagerService.removeFile(
      id,
      FileOwnerType.PROJECT,
      FileCategory.PROJECT_IMAGE,
    );
  }

  async reorder(userId: string, orderedIds: string[]) {
    await this.dataSource.transaction(async (manager) => {
      // 校验:这批 id 必须全部属于当前用户,数量也要对得上,防止越权改别人项目的顺序
      const projects = await manager.find(Project, {
        where: { id: In(orderedIds), userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (projects.length === 0) {
        return projects;
      }

      if (projects.length !== orderedIds.length) {
        throw new ForbiddenException(
          'Some projects do not belong to the current user',
        );
      }

      const projectMap = new Map(projects.map((p) => [p.id, p]));

      await Promise.all(
        orderedIds.map((id, index) => {
          const project = projectMap.get(id)!;
          project.sortOrder = -(index + 1);
          return manager.save(Project, project);
        }),
      );

      await Promise.all(
        orderedIds.map((id, index) => {
          const project = projectMap.get(id)!;
          project.sortOrder = index;
          return manager.save(Project, project);
        }),
      );
    });

    return await this.findAll(userId);
  }
}
