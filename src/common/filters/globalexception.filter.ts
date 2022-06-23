import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status = exception.response ? exception.response.status ? exception.response.status : null : null;
        let message = exception.message;
        if (!status) {
            status = 500;
            message = "Internal server error!"
        }
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