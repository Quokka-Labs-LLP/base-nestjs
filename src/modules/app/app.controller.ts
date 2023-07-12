import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { AppService } from './app.service';

/**
 *
 */
@ApiTags(AppController.name)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('home')
  async getHello(): Promise<ResponseInterface> {
    const response = this.appService.getHello();
    return { status: 1000, data: { response } };
  }

  @Get('healthcheck')
  async healthCheck(): Promise<ResponseInterface> {
    const response = this.appService.healthCheck();
    return { status: 1000, data: { response } };
  }
}
