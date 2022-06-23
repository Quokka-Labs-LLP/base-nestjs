import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { CommonResponseCodeEnum } from "../constants/common-response-code.contants";
import { CommonResponseMessageEnum } from "../constants/common-response-message.contants";

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map((response) => ({
            status: true,
            code: response.code,
            message: `${CommonResponseMessageEnum[CommonResponseCodeEnum[response.code]]}`,
            data: response.data,
        })));
    }
}