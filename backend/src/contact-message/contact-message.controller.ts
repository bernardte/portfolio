import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactMessageService } from './contact-message.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contact-message')
export class ContactMessageController {
  constructor(private readonly contactMessageService: ContactMessageService) {}

  @Post('/:slug')
  async create(
    @Param('slug') slug: string,
    @Body() createContactMessageDto: CreateContactMessageDto,
  ) {
    return await this.contactMessageService.create(createContactMessageDto, slug);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User) {
    return await this.contactMessageService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.contactMessageService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.contactMessageService.remove(id);
  }
}
