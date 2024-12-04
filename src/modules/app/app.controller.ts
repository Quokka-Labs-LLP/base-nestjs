import {
  Body,
  Controller,
  Get,
  Post,
  RequestTimeoutException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { AppService } from './app.service';
import { sayMyNameDTO } from './dtos/say-my-name.dto';

/**
 *
 */
@ApiTags(AppController.name)
@Controller()
export class AppController {
  /**
   *
   * @param appService Inject AppService instance to use it's methods
   */
  constructor(private readonly appService: AppService) {}

  /**
   * @returns ResponseInterface type response
   */
  @Get('home')
  async getHello(): Promise<ResponseInterface> {
    return this.appService.getHello();
  }

  /**
   * @returns ResponseInterface type response
   */
  @Get('healthcheck')
  async healthCheck(): Promise<ResponseInterface> {
    return this.appService.healthCheck();
  }

  /**
   * @param body - The request body containing name and age.
   * @returns ResponseInterface type response
   */
  @Post('saymyname')
  async sayMyName(@Body() body: sayMyNameDTO): Promise<ResponseInterface> {
    return this.appService.sayMyName(body.name, body.age);
  }

  /**
   * @returns ResponseInterface type response
   */
  @Get('throwerror')
  async throwError(): Promise<ResponseInterface> {
    throw new RequestTimeoutException();
  }

  /**
   * @returns ResponseInterface type response
   */
  @Post('businessvalidation')
  async businessValidationFail(): Promise<ResponseInterface> {
    return this.appService.businessValidationFail();
  }
}
