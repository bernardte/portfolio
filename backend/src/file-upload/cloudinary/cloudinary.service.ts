import { Inject, Injectable } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CloudinaryProvider.provide)
    private readonly cloudinary,
  ) {}

  uploadFile(
    file: Express.Multer.File,
    folderName: string,
    resourceType: 'image' | 'raw',
    publicId: string,
    isPrivate = true,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: resourceType,
          public_id: publicId,
          type: isPrivate ? 'authenticated' : 'upload',
          filename_override: file.originalname,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // 生成限时预览链接(5分钟有效),每次调用都不同,不会永久暴露/预览
  getSignedUrl(
    publicId: string,
    resourceType: 'image' | 'raw',
    options: {
      inline?: boolean;
      expiresInSeconds?: number;
    } = {},
  ): string {
    const { inline = true, expiresInSeconds = 300 } = options;
    const privateDownloadFile = this.cloudinary.utils.private_download_url(
      publicId,
      undefined,
      {
        resource_type: resourceType,
        type: 'authenticated',
        attachment: !inline,
        expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
        filename_override: true,
        use_filename_as_display_name: true,
      },
    );


    return privateDownloadFile;
  }

  removeFile(
    publicId: string,
    resourceType: 'image' | 'raw',
    isPrivate = true,
  ) {
    return this.cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: isPrivate ? 'authenticated' : 'upload',
    });
  }
}
