import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ContactMessageService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactMessageRepository: Repository<ContactMessage>,
    private readonly profileService: ProfileService,
  ) {}

  async create(createContactMessageDto: CreateContactMessageDto, slug: string) {
    const profile = await this.profileService.getProfileBySlug(slug);

    if (!profile) {
      throw new NotFoundException('Profile not found!');
    }

    const createContactMessage = this.contactMessageRepository.create({
      ...createContactMessageDto,
      profile,
      profileId: profile.id,
    });

    return await this.contactMessageRepository.save(createContactMessage);
  }

  async findAll(user: User) {
    const profile = await this.profileService.findOneByName(user.name);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.contactMessageRepository.find({
      where: {
        profileId: profile.id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const contactMessage = await this.contactMessageRepository.findOneBy({
      id,
    });

    if (!contactMessage) {
      throw new NotFoundException('contact message not found!');
    }

    return contactMessage;
  }

  async remove(id: string) {
    const findContactMessageToRemove = await this.findOne(id);

    await this.contactMessageRepository.remove(findContactMessageToRemove);
  }
}
