import { FileValidator } from '@nestjs/common';

export interface MagicTypeOptions {
  allowedMimeTypes: string[];
}

export class MagicFileTypeValidator extends FileValidator<MagicTypeOptions> {
  constructor(protected readonly validationOption: MagicTypeOptions) {
    super(validationOption);
  }

  async isValid(file?: Express.Multer.File): Promise<boolean> {
    if (!file?.buffer) {
      return false;
    }

    if (!this.validationOption.allowedMimeTypes.includes(file.mimetype)) {
      return false;
    }

    // check magic number by reading the bytes of the file
    const { fileTypeFromBuffer } = await eval(`import('file-type')`);
    const detectedType = await fileTypeFromBuffer(file.buffer);

    if (!detectedType) return false;

    return detectedType.mime === file.mimetype;
  }

  buildErrorMessage(): string {
    return 'Invalid file type.';
  }
}
