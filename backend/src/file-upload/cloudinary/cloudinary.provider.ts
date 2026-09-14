import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const cloudinaryApiSecret = configService.getOrThrow(
      'cloudinaryconfig.cloudinary_api_secret',
    );
    const cloudinaryApiKey = configService.getOrThrow(
      'cloudinaryconfig.cloudinary_api_key',
    );
    const cloudinaryKeyName = configService.getOrThrow(
      'cloudinaryconfig.cloudinary_key_name',
    );

    cloudinary.config({
        cloud_name: cloudinaryKeyName,
        api_key: cloudinaryApiKey,
        api_secret: cloudinaryApiSecret
    });

    return cloudinary;
  },
};
