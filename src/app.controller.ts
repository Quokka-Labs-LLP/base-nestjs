import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  getHello(): {code: number, data: string} {

    const msg =  this.appService.getHello();
    return {
      code : 102,
      data: `Working!!, ${msg}`
    }
  }
}
