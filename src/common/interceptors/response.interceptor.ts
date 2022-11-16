import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private readonly configService: ConfigService) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<Request>();
        const now = Date.now();

        // If environment is prod/production then need to hide class name and handler name in metadata
        if (this.configService.get('NODE_ENV') === 'production' || this.configService.get('NODE_ENV') === 'prod') {
            return next.handle().pipe(map((response: ResponseInterface) => ({
                success: true,
                status: response?.status || 200,
                message: response?.message || '',
                data: response?.data || new Object(),
                metadata: {
                    api_version: this.configService.get('API_VERSION'),
                    api_url: request.url,
                    http_method: request.method,
                    response_time: `${Date.now() - now}ms`
                }
            })));
        }

        // If environment is dev/development then can show class name and handler name in metadata
        return next.handle().pipe(map((response: ResponseInterface) => ({
            success: true,
            status: response?.status || 200,
            message: response?.message || '',
            data: response?.data || new Object(),
            metadata: {
                api_version: this.configService.get('API_VERSION'),
                api_url: request.url,
                http_method: request.method,
                class_name: context.getClass().name,
                handler_name: context.getHandler().name,
                response_time: `${Date.now() - now}ms`
            }
        })));
    }
}