import { ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { MagicFileTypeValidator } from '../validators/file-type.validator';

export function createFilePipe(
  maxFileSize: number,
  allowedMimeTypes: string[],
  fileName: string,
  fileIsRequired: boolean,
) {
  return new ParseFilePipe({
    fileIsRequired,
    validators: [
      new MaxFileSizeValidator({
        maxSize: maxFileSize,
        message: `${fileName} must be smaller than ${maxFileSize / (1024 * 1024)}MB`,
      }),
      new MagicFileTypeValidator({
        allowedMimeTypes,
      }),
    ],
  });
}
