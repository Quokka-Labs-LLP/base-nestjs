import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const env =
      this.configService.get('NODE_ENV') === 'local' ||
      this.configService.get('NODE_ENV') === 'development';

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response
      .status(
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      )
      .json({
        success: false,
        status:
          exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          exception instanceof HttpException
            ? exception.message
            : 'Internal server error',
        data: {
          ...(env &&
            exception instanceof HttpException && {
              error: exception.getResponse(),
            }),
        },
      });
  }
}
