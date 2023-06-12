import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { AppService } from './app.service';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';

@ApiTags(AppController.name)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthenticationGuard)
  @Get('home')
  async getHello(@Req() req: Request): Promise<ResponseInterface> {
    return { message: this.appService.getHello() };
  }

  @Get('healthcheck')
  async healthCheck(): Promise<ResponseInterface> {
    return { message: this.appService.healthCheck() };
  }
}
