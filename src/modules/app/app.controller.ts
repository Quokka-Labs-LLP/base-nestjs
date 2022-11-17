import { Controller, Get } from '@nestjs/common';
import { ResponseInterface } from 'src/common/interfaces/Responses/response.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(): Promise<ResponseInterface> {
    return { message: this.appService.getHello() };
  }

  @Get('healthcheck')
  async healthCheck(): Promise<ResponseInterface> {
    return { message: this.appService.healthCheck() };
  }
}
