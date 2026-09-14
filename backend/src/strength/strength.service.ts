import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStrengthDto } from './dto/create-strength.dto';
import { UpdateStrengthDto } from './dto/update-strength.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Strength } from './entities/strength.entity';
import { DataSource, Repository } from 'typeorm';
import { ProfileService } from '../profile/profile.service';
import { User } from '../auth/entities/user.entity';
import { FileManagerService } from '../file-manager/file-manager.service';
import {
  FileCategory,
  FileOwnerType,
  FileResourceType,
} from '../file-manager/entities/file.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class StrengthService {
  constructor(
    @InjectRepository(Strength)
    private readonly strengthRepository: Repository<Strength>,
    private readonly profileService: ProfileService,
    private readonly fileManagerService: FileManagerService,
    private readonly datasource: DataSource,
    private readonly authService: AuthService,
  ) {}

  async uploadStrengthIcon(file: Express.Multer.File) {
    const result = await this.fileManagerService.uploadFile(
      FileCategory.STRENGTH,
      FileResourceType.IMAGE,
      'strength icon',
      file,
      false,
    );

    const { secureUrl, id } = result;

    return {
      fileId: id,
      icon: secureUrl,
    };
  }

  async create(
    createStrengthDto: CreateStrengthDto,
    profileId: string,
    user: User,
  ) {
    const profile = await this.profileService.findOneById(profileId);
    const { fileId, ...strengthData } = createStrengthDto;

    console.log('createStrengthDto:', createStrengthDto);
    console.log('fileId:', fileId);

    if (profile.userId !== user.id) {
      throw new ForbiddenException(
        'Only the owner of the profile allow to add new strength',
      );
    }

    return await this.datasource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(Strength)
        .set({ sortOrder: () => '"sortOrder" + 1' })
        .where('profileId = :profileId', { profileId: profileId })
        .execute();

      const newStrength = manager.create(Strength, {
        ...strengthData,
        profileId,
        profile,
      });

      await manager.save(newStrength);

      if (fileId) {
        await this.fileManagerService.attachFile(
          fileId,
          newStrength.id,
          FileOwnerType.STRENGTH,
          manager,
        );
      }

      return newStrength;
    });
  }

  async findAll(profileId: string) {
    const strengths = await this.strengthRepository.find({
      where: { profileId: profileId },
      order: { sortOrder: 'ASC' },
    });

    return strengths;
  }

  async findOne(profileId: string, strengthId: string, user: User) {
    const strength = await this.strengthRepository.findOne({
      where: {
        id: strengthId,
        profileId,
        profile: {
          user: {
            id: user.id,
          },
        },
      },
    });

    if (!strength) throw new NotFoundException('strength not found!');

    return strength;
  }

  async findOneByProfileId(profileId: string) {
    const strength = await this.strengthRepository.findOne({
      where: {
        profile: {
          id: profileId,
        },
      },
    });

    if (!strength) {
      throw new NotFoundException('User strength is not found!');
    }

    return strength;
  }

  async update(
    profileId: string,
    updateStrengthDto: UpdateStrengthDto,
    strengthId: string,
    user: User,
  ) {
    await this.findOne(profileId, strengthId, user);

    if (updateStrengthDto.fileId) {
      await this.fileManagerService.replaceAttachFile(
        updateStrengthDto.fileId,
        strengthId,
        FileOwnerType.STRENGTH,
        FileCategory.STRENGTH,
      );
    }

    await this.strengthRepository.update(strengthId, {
      title: updateStrengthDto.title,
      color: updateStrengthDto.color,
      icon: updateStrengthDto.icon,
      description: updateStrengthDto.description,
    });

    return await this.findOne(profileId, strengthId, user);
  }

  async remove(strengthId: string, profileId: string) {
    await this.datasource.transaction(async (manager) => {
      const strengths = await manager.find(Strength, {
        where: {
          profileId: profileId,
        },
        order: {
          sortOrder: 'ASC',
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (strengths.length === 0) {
        return strengths;
      }

      const strength = strengths.find((strength) => strength.id === strengthId);

      if (!strength) throw new NotFoundException('Strength not found!');

      const remainingStrength = strengths
        .filter((strength) => strength.id !== strengthId)
        .map((strength, index) => {
          strength.sortOrder = index;

          return strength;
        });

      await manager.remove(Strength, strength);

      await manager.save(Strength, remainingStrength);

      return remainingStrength;
    });

    const fileFound = await this.fileManagerService.getCurrentFile(
      strengthId,
      FileOwnerType.STRENGTH,
      FileCategory.STRENGTH,
      false,
    );

    if (fileFound?.id) {
      await this.fileManagerService.removeFile(
        strengthId,
        FileOwnerType.STRENGTH,
        FileCategory.STRENGTH,
      );
    }

    return;
  }

  async reorder(profileId: string, orderedIds: string[]) {
    return await this.datasource.transaction(async (manager) => {
      const strengths = await manager.find(Strength, {
        where: {
          profileId: profileId,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (strengths.length === 0) {
        return strengths;
      }

      const existingIds = strengths.map((strength) => strength.id).sort();
      const incomingIds = [...orderedIds].sort();

      const lengthMatch = existingIds.length === incomingIds.length;
      const checkIdsMatch = existingIds.every(
        (id, index) => id === incomingIds[index],
      );

      const isExactMatch = lengthMatch && checkIdsMatch;

      if (!isExactMatch) {
        throw new BadRequestException(
          'orderedIds must exactly match your existing strength',
        );
      }

      await manager.query(
        `
        UPDATE strength
        SET "sortOrder" = data.new_order
        FROM (
          SELECT
            unnest($1::uuid[]) AS id,
            unnest($2::int[]) AS new_order
        ) AS data
         WHERE strength.id = data.id
         AND strength."profileId" = $3
        `,
        [orderedIds, orderedIds.map((_, index) => index), profileId],
      );

      return await manager.find(Strength, {
        where: {
          profileId: profileId,
        },
        order: {
          sortOrder: 'ASC',
        },
      });
    });
  }

  async findStrengthsBySlug(slug: string) {
    const strengths = await this.strengthRepository.find({
      where: {
        profile: {
          slug: slug,
        },
      },
      order: {
        sortOrder: 'ASC',
      },
    });

    if (strengths.length === 0) {
      return strengths;
    }

    return strengths;
  }
}
