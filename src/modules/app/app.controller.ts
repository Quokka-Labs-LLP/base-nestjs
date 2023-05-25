import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { AppService } from './app.service';

@ApiTags(AppController.name)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('home')
  async getHello(): Promise<ResponseInterface> {
    return { message: this.appService.getHello() };
  }

  @Get('healthcheck')
  async healthCheck(): Promise<ResponseInterface> {
    return { message: this.appService.healthCheck() };
  }
}
