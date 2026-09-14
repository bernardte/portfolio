import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
// import { FileUploadController } from './file-upload.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    CloudinaryModule,
    MulterModule.register({
      storage: memoryStorage(),
    })
  ],
  // controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService]
})
export class FileUploadModule {}
