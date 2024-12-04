import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

/**
 *
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   *
   * @param configService Inject config service object to use in the methods
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   *
   * @param exception Will get any type of exceptions that will be unknown.
   * @param host Provides methods for retrieving the arguments being passed to a handler. Allows choosing the appropriate execution context (e.g., Http, RPC, or WebSockets) to retrieve the arguments from.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const env =
      this.configService.get('NODE_ENV') === 'local' ||
      this.configService.get('NODE_ENV') === 'development';

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const httpStatusCode = getHttpStatusCode(exception);
    const message = getMessage(exception);

    response.status(httpStatusCode).json({
      // success: false,
      code: httpStatusCode,
      message,
      error:
        exception instanceof UnprocessableEntityException
          ? typeof exception === 'object' &&
            exception &&
            'response' in exception
            ? exception.getResponse()
            : null
          : env
          ? typeof exception === 'object' && exception && 'stack' in exception
            ? exception.stack
            : null
          : null,
    });
  }
}

function getHttpStatusCode(exception: unknown) {
  return exception instanceof UnprocessableEntityException
    ? HttpStatus.BAD_REQUEST
    : exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
}

function getMessage(exception: unknown) {
  return exception instanceof UnprocessableEntityException
    ? 'Invalid request body or query paramter(s)'
    : exception instanceof HttpException
    ? exception.message
    : 'Internal server error';
}
