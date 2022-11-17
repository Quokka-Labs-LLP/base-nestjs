import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();

        // If environment is prod/production then need to hide error stack
        if (this.configService.get('NODE_ENV') === 'production' || this.configService.get('NODE_ENV') === 'prod') {
            response.status(exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                status: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
                message: exception instanceof HttpException ? exception.message : 'Internal server error',
                metadata: {
                    api_version: this.configService.get('API_VERSION'),
                    api_url: request.url,
                    http_method: request.method
                }
            });
        }

        // If environment is local/devlopment then need to show error stack
        response.status(exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
            message: exception instanceof HttpException ? exception.message : 'Internal server error',
            error: exception instanceof HttpException ? exception.stack : null,
            metadata: {
                api_version: this.configService.get('API_VERSION'),
                api_url: request.url,
                http_method: request.method
            }
        });
    }
}