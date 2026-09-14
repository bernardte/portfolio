import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import {
  File,
  FileCategory,
  FileOwnerType,
  FileResourceType,
} from './entities/file.entity';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class FileManagerService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,

    private readonly fileUploadService: FileUploadService,
  ) {}

  /**
   * Get the current file owned by a resource.
   *
   * Example:
   * Profile Avatar
   * Profile Resume
   * Project Image
   */
  async getCurrentFile(
    ownerId: string,
    ownerType: FileOwnerType,
    category: FileCategory,
    isPrivate?: boolean,
  ) {
    const file = await this.fileRepository.findOne({
      where: {
        ownerId,
        ownerType,
        category,
        isPrivate,
      },
    });

    return file;
  }

  /**
   * Replace an existing file.
   *
   * 1. Find existing file
   * 2. Delete old file from Cloudinary
   * 3. Delete old database record
   * 4. Upload new file
   * 5. Save new database record
   */
  async replaceFile(
    ownerId: string,
    ownerType: FileOwnerType,
    category: FileCategory,
    resourceType: FileResourceType,
    folder: string,
    file: Express.Multer.File,
    isPrivate: boolean,
  ) {
    const existing = await this.getCurrentFile(
      ownerId,
      ownerType,
      category,
      isPrivate,
    );

    /**
     * Remove existing file
     */
    if (existing) {
      await this.fileUploadService
        .removeFile(
          existing.publicId,
          existing.resourceType,
          existing.isPrivate,
        )
        .catch(() => {
          // Cloudinary deletion failure
          // does not block the replacement process.
        });

      await this.fileRepository.remove(existing);
    }

    /**
     * Keep original file extension.
     *
     * Important for Cloudinary RAW files
     * such as PDF/DOC/DOCX.
     */
    const publicId = randomUUID();
    /**
     * Upload new file
     */
    const uploadResult = await this.fileUploadService.uploadFile(
      file,
      folder,
      resourceType,
      publicId,
      isPrivate,
    );

    /**
     * Save file metadata
     */
    const fileRecord = this.fileRepository.create({
      publicId: uploadResult.public_id,
      fileOriginalName: file.originalname,
      fileMimeType: file.mimetype,

      ownerId,
      ownerType,

      fileSize: file.size,
      secureUrl: uploadResult.secure_url,

      category,
      resourceType,
      isPrivate,
    });

    return this.fileRepository.save(fileRecord);
  }

  /**
   * Remove a file from Cloudinary and database.
   */
  async removeFile(
    ownerId: string,
    ownerType: FileOwnerType,
    category: FileCategory,
  ) {
    const fileRecord = await this.getCurrentFile(
      ownerId,
      ownerType,
      category,
      false,
    );

    if (!fileRecord) {
      throw new NotFoundException(`${category} not found`);
    }

    await this.fileUploadService.removeFile(
      fileRecord.publicId,
      fileRecord.resourceType,
      fileRecord.isPrivate,
    );

    await this.fileRepository.remove(fileRecord);
  }

  /**
   * Get preview/download URL.
   */
  async getFileUrl(
    ownerId: string,
    ownerType: FileOwnerType,
    category: FileCategory,
    mode: 'preview' | 'download',
    isPrivate: boolean = true,
  ) {
    const fileRecord = await this.getCurrentFile(
      ownerId,
      ownerType,
      category,
      (isPrivate = true),
    );

    if (!fileRecord) {
      throw new NotFoundException(`${category} not found`);
    }

    /**
     * Public file preview
     * can use permanent secure URL.
     */
    if (!fileRecord.isPrivate && mode === 'preview') {
      return {
        url: fileRecord.secureUrl,
        fileName: fileRecord.fileOriginalName,
        mimeType: fileRecord.fileMimeType,
      };
    }

    /**
     * Private file or download
     * requires signed URL.
     */
    const url = await this.fileUploadService.getSignedUrl(
      fileRecord.publicId,
      fileRecord.resourceType,
      {
        inline: mode === 'preview',
        expiresInSeconds: 300,
      },
    );

    return {
      url,
      fileName: fileRecord.fileOriginalName,
      mimeType: fileRecord.fileMimeType,
    };
  }

  async uploadFile(
    fileCategory: FileCategory,
    resourceType: FileResourceType,
    folder: string,
    file: Express.Multer.File,
    isPrivate: boolean,
  ) {
    const publicId = randomUUID();

    const uploadResult = await this.fileUploadService.uploadFile(
      file,
      folder,
      resourceType,
      publicId,
      isPrivate,
    );

    const fileRecord = this.fileRepository.create({
      publicId: uploadResult.public_id,
      fileOriginalName: file.originalname,
      fileMimeType: file.mimetype,
      ownerId: null,
      ownerType: null,
      fileSize: file.size,
      secureUrl: uploadResult.secure_url,
      category: fileCategory,
      resourceType,
      isPrivate,
    });

    const newCreatedFile = await this.fileRepository.save(fileRecord);

    const { publicId: savedPublicId, ...fileInstance } = newCreatedFile;

    return fileInstance;
  }

  async attachFile(
    fileId: string,
    ownerId: string,
    ownerType: FileOwnerType,
    manager: EntityManager,
  ) {
    const fileRecord = await manager
      .getRepository(File)
      .findOneBy({ id: fileId });

    if (!fileRecord) {
      throw new NotFoundException('File Not Found!');
    }

    if (fileRecord.ownerId && fileRecord.ownerId !== ownerId) {
      throw new ConflictException('File already attached to another owner');
    }

    fileRecord.ownerId = ownerId;
    fileRecord.ownerType = ownerType;

    return await this.fileRepository.save(fileRecord);
  }

  async replaceAttachFile(
    newFileId: string,
    ownerId: string,
    ownerType: FileOwnerType,
    category: FileCategory,
  ) {
    const newFile = await this.fileRepository.findOneBy({
      id: newFileId,
    });

    if (!newFile) {
      throw new NotFoundException('File not found');
    }

    if (newFile.ownerId && newFile.ownerId !== ownerId) {
      throw new ConflictException('File already attached to others owners');
    }

    if (newFile.category !== category) {
      throw new ConflictException('File category mismatch');
    }

    const oldFile = await this.getCurrentFile(
      ownerId,
      ownerType,
      category,
      false,
    );

    // Already using this file
    if (oldFile?.id === newFile.id) {
      return newFile;
    }

    // Remove old file first because
    // (ownerId, ownerType, category) is UNIQUE
    if (oldFile) {
      await this.fileUploadService.removeFile(
        oldFile.publicId,
        oldFile.resourceType,
        oldFile.isPrivate,
      );

      await this.fileRepository.remove(oldFile);
    }

    // Attach new file
    newFile.ownerId = ownerId;
    newFile.ownerType = ownerType;

    return await this.fileRepository.save(newFile);
  }
}
