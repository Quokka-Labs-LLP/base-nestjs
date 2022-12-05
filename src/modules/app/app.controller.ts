import { Controller, Get, Version } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from 'src/common/interfaces/Responses/response.interface';
import { AppService } from './app.service';

@ApiTags(AppController.name)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/home')
  async getHello(): Promise<ResponseInterface> {
    return { message: this.appService.getHello() };
  }

  @Get('healthcheck')
  async healthCheck(): Promise<ResponseInterface> {
    return { message: this.appService.healthCheck() };
  }
}
