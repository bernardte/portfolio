import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileExistPipe } from './pipes/profile-exist.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Ownership } from '../common/decorators/ownership.decorator';
import { Profile } from './entities/profile.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ProfileMapper } from './mapper/profile.mappper';
import { FileCategory } from '../file-manager/entities/file.entity';
import { createFilePipe } from '../common/pipes/file.pipe';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @CurrentUser() user: User,
  ) {
    const profile = await this.profileService.create(createProfileDto, user);

    return ProfileMapper.toResponse(profile);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOneByUserName(@CurrentUser() user: User) {
    const profile = await this.profileService.findOneByName(user.name);

    return ProfileMapper.toResponse(profile);
  }

  @Get('/summary')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getProfileSummary(@CurrentUser() user: User) {
    const summaryMetrics = await this.profileService.getProfileSummary(user);

    return ProfileMapper.toSummaryResponse(summaryMetrics);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.findOneById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Ownership({ resourceEntity: Profile, param: 'id' })
  async update(
    @Param('id', ParseUUIDPipe, ProfileExistPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profileService.update(id, updateProfileDto);

    return ProfileMapper.toResponse(profile);
  }

  @Patch(':profileId/resume')
  @HttpCode(HttpStatus.OK)
  @Ownership({ resourceEntity: Profile, param: 'profileId' })
  @UseInterceptors(FileInterceptor('resumeFile'))
  async updateResumeFile(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @UploadedFile(
      createFilePipe(
        5 * 1024 * 1024,
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        'Resume file',
        true,
      ),
    )
    resumeFile: Express.Multer.File,
  ) {
    return await this.profileService.updateResume(profileId, resumeFile);
  }

  @Patch(':profileId/avatar')
  @HttpCode(HttpStatus.OK)
  @Ownership({ resourceEntity: Profile, param: 'profileId' })
  @UseInterceptors(FileInterceptor('avatarFile'))
  async updateAvatar(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @UploadedFile(
      createFilePipe(
        5 * 1024 * 1024,
        ['image/jpeg', 'image/png', 'image/webp'],
        'Avatar file',
        true,
      ),
    )
    file: Express.Multer.File,
  ) {
    return await this.profileService.updateAvatar(profileId, file);
  }

  @Get(':profileId/avatar/url')
  @Ownership({ resourceEntity: Profile, param: 'profileId' })
  async getAvatarUrl(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Query('mode') mode: 'preview' | 'download' = 'preview',
  ) {
    return this.profileService.getFileUrl(profileId, FileCategory.AVATAR, mode);
  }

  @Get(':profileId/resume/url')
  @Ownership({ resourceEntity: Profile, param: 'profileId' })
  async getResumeUrl(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Query('mode') mode: 'preview' | 'download' = 'preview',
  ) {
    return await this.profileService.getFileUrl(
      profileId,
      FileCategory.RESUME,
      mode,
    );
  }

  @Delete(':profileId/avatar')
  @Ownership({ resourceEntity: Profile, param: 'profileId' })
  async removeAvatar(@Param('profileId', ParseUUIDPipe) profileId: string) {
    await this.profileService.removeAvatar(profileId);
    return { message: 'avatar removed' };
  }

  @Delete(':profileId/resume')
  @Ownership({ resourceEntity: Profile, param: 'profileId' })
  async removeResume(@Param('profileId', ParseUUIDPipe) profileId: string) {
    await this.profileService.removeResumeFile(profileId);
    return { message: 'resume removed' };
  }
}
