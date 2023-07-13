import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

/**
 *
 */
@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  /**
   *
   * @param configService Inject config service object to use in the methods
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   *
   * @param exception Will get all HTTP types of exceptions
   * @param host Provides methods for retrieving the arguments being passed to a handler. Allows choosing the appropriate execution context (e.g., Http, RPC, or WebSockets) to retrieve the arguments from.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const env =
      this.configService.get('NODE_ENV') === 'local' ||
      this.configService.get('NODE_ENV') === 'development';

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      status: status,
      message: exception.message,
      data: { ...(env && { error: exception.stack }) },
    });
  }
}
