import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StrengthService } from './strength.service';
import { CreateStrengthDto } from './dto/create-strength.dto';
import { UpdateStrengthDto } from './dto/update-strength.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { StrengthMapper } from './mapper/strength.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFilePipe } from '../common/pipes/file.pipe';
import { ReorderStrengthDto } from './dto/reorder-strength.dto';

@UseGuards(JwtAuthGuard)
@Controller('profiles/:profileId/strengths')
export class StrengthController {
  constructor(private readonly strengthService: StrengthService) {}

  @Post('/upload-icon')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('iconFile'))
  async uploadStrengthIcon(
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
    return await this.strengthService.uploadStrengthIcon(iconFile);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async reorder(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() reorderStrengthDto: ReorderStrengthDto,
  ) {
    const strength = await this.strengthService.reorder(
      profileId,
      reorderStrengthDto.orderedIds,
    );

    return StrengthMapper.toResponseList(strength);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() createStrengthDto: CreateStrengthDto,
    @CurrentUser() user: User,
  ) {
    const strength = await this.strengthService.create(
      createStrengthDto,
      profileId,
      user,
    );

    return StrengthMapper.toResponse(strength);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(@Param('profileId', ParseUUIDPipe) profileId: string) {
    const strengths = await this.strengthService.findAll(profileId);

    return StrengthMapper.toResponseList(strengths);
  }

  @Get(':strengthId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Param('strengthId', ParseUUIDPipe) strengthId: string,
    @CurrentUser() user: User,
  ) {
    const strength = await this.strengthService.findOne(
      profileId,
      strengthId,
      user,
    );

    return StrengthMapper.toResponse(strength);
  }

  @Patch(':strengthId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Param('strengthId', ParseUUIDPipe) strengthId: string,
    @Body() updateStrengthDto: UpdateStrengthDto,
    @CurrentUser() user: User,
  ) {
    const strength = await this.strengthService.update(
      profileId,
      updateStrengthDto,
      strengthId,
      user,
    );

    return StrengthMapper.toResponse(strength);
  }

  @Delete(':strengthId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Param('strengthId', ParseUUIDPipe) strengthId: string,
  ) {
    return await this.strengthService.remove(strengthId, profileId);
  }
}
