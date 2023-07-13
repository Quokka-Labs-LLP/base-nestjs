import { Injectable } from '@nestjs/common';

/**
 *
 */
@Injectable()
export class AppService {
  /**
   * @returns string type value
   */
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * @returns string type value
   */
  healthCheck(): string {
    return 'Server up & running';
  }
}
