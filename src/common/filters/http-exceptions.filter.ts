import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) { }
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const status = exception.getStatus();

        // If environment is prod/production then need to hide error stack
        if (this.configService.get('NODE_ENV') === 'production' || this.configService.get('NODE_ENV') === 'prod') {
            response
                .status(status)
                .json({
                    success: false,
                    status: status,
                    message: exception.message,
                    metadata: {
                        api_version: this.configService.get('API_VERSION'),
                        api_url: request.url,
                        http_method: request.method
                    }
                });
        }

        // If environment is local/devlopment then need to show error stack
        response
            .status(status)
            .json({
                success: false,
                status: status,
                message: exception.message,
                error: exception.stack?.toString(),
                metadata: {
                    api_version: this.configService.get('API_VERSION'),
                    api_url: request.url,
                    http_method: request.method
                }
            });
    }
}