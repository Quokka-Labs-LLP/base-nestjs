import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  getHello(): {code: number, data: string} {

    const msg =  this.appService.getHello();
    return {
      code : 1004,
      data: `Working!!, ${msg}`
    }
  }
}
