import { HttpException, HttpStatus } from "@nestjs/common";
import { CommonResponseCodeEnum } from "../constants/common-response-code.contants";
import { CommonResponseMessageEnum } from "../constants/common-response-message.contants";

export class ResponseError extends HttpException {
  constructor(statusCode) {
    super(
      `${CommonResponseMessageEnum[CommonResponseCodeEnum[statusCode]]}`,
      HttpStatus.FORBIDDEN,
    );
  }
}
