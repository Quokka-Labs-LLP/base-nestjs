import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseInterface } from '../interfaces/Responses/response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map((response: ResponseInterface) => ({
            success: true,
            status: response?.status || 200,
            message: response?.message || '',
            data: response?.data || new Object(),
        })));
    }
}