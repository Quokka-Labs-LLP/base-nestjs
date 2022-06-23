import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        let message = exception.message;

        if (status == 404)
            message = "Invalid EndPoint!";
            
        response
            .status(status)
            .json({
                status: false,
                code: status,
                message: message,
                data: {}
            });
    }
}