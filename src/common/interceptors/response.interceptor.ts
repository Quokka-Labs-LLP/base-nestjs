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
    const ctx = context.switchToHttp();
    const httpResponse = ctx.getResponse();

    return next.handle().pipe(
      map((response: ResponseInterface) => {
        if (response instanceof StreamableFile) {
          return response;
        }

        if (response.httpStatusCode) {
          httpResponse.status(response.httpStatusCode);
        }

        return {
          code: response.code,
          message: !response.success
            ? response.message ?? null
            : responsecodes[
                String(response?.code) as keyof typeof responsecodes
              ] || null,
          data: response.data || new Object(),
          error:
            (!response.success &&
              responsecodes[
                String(response?.code) as keyof typeof responsecodes
              ]) ||
            undefined,
        };
      }),
    );
  }
}
