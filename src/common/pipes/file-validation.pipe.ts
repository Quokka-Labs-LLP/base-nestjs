import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';

const FileValidationPipe = (fileTypes: string, fileSize: number) => {
  return new ParseFilePipe({
    fileIsRequired: true,
    errorHttpStatusCode: 422,
    validators: [
      new FileTypeValidator({ fileType: `.(${fileTypes})` }),
      new MaxFileSizeValidator({ maxSize: fileSize }),
    ],
    exceptionFactory(error) {
      throw new UnprocessableEntityException({
        users_csv_file: error,
      });
    },
  });
};

export default FileValidationPipe;
