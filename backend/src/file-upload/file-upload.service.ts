import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
    resourceType: 'raw' | 'image',
    publicId: string,
    isPrivate: boolean,
  ) {
    return await this.cloudinaryService.uploadFile(
      file,
      folderName,
      resourceType,
      publicId,
      isPrivate,
    );
  }
  
  async getSignedUrl(
    publicId: string,
    resourceType: 'image' | 'raw',
    options: { inline?: boolean; expiresInSeconds?: number },
  ) {
    return this.cloudinaryService.getSignedUrl(
      publicId,
      resourceType,
      options,
    );
  }

  async removeFile(
    publicId: string,
    resourceType: 'image' | 'raw',
    isPrivate: boolean,
  ) {
    return await this.cloudinaryService.removeFile(
      publicId,
      resourceType,
      isPrivate,
    );
  }
}
