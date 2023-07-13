import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import responsecodes from '@config/json/response-codes.json';

/**
 *
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   *
   * @param context Interface describing details about the current request pipeline.
   * @param next Interface providing access to the response stream.
   * @returns Promise of streams of response (Observable)
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((response: ResponseInterface) => {
        if (response instanceof StreamableFile) {
          return response;
        }
        return {
          success: true,
          status: response.status,
          message:
            responsecodes[
              String(response?.status) as keyof typeof responsecodes
            ] || '',
          data: response.data || new Object(),
        };
      }),
    );
  }
}
