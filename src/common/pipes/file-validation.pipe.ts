import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';

/**
 *
 * @param fileTypes File types that are allowed to process
 * @param fileSize Maximum size allowed to process
 * @returns ParseFilePipe to validate files
 */
const FileValidationPipe = (fileTypes: string, fileSize: number) => {
  return new ParseFilePipe({
    fileIsRequired: true,
    errorHttpStatusCode: 422,
    validators: [
      new FileTypeValidator({ fileType: `.(${fileTypes})` }),
      new MaxFileSizeValidator({ maxSize: fileSize }),
    ],
    /**
     *
     * @param error File validation error
     */
    exceptionFactory(error) {
      throw new UnprocessableEntityException({
        users_csv_file: error,
      });
    },
  });
};

export default FileValidationPipe;
