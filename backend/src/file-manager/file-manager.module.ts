import { Module } from '@nestjs/common';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { File } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { FileManagerService } from './file-manager.service';

@Module({
  imports: [
    FileUploadModule,
    TypeOrmModule.forFeature([File]),
  ],
  providers: [FileManagerService],
  exports: [FileManagerService],
})
export class FileManagerModule {}
