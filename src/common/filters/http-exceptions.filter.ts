import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) { }
    catch(exception: HttpException, host: ArgumentsHost) {
        const env = this.configService.get('NODE_ENV') === 'local' || this.configService.get('NODE_ENV') === 'development';

        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                success: false,
                status: status,
                message: exception.message,
                data: {
                    ...(env && { error: exception.stack })
                }
            });
    }
}