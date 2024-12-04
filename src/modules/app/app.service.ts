import { Injectable } from '@nestjs/common';
import { ResponseInterface } from '@interfaces/Responses/response.interface';

/**
 *
 */
@Injectable()
export class AppService {
  getHello(): ResponseInterface {
    return {
      code: 1000,
      success: true,
      data: [{ id: 1, name: 'John' }],
    };
  }

  healthCheck(): ResponseInterface {
    return {
      code: 1001,
      success: true,
      data: {
        healthStatus: 'good',
      },
    };
  }

  sayMyName(name: string, age: number): ResponseInterface {
    return {
      success: true,
      code: 1002,
      data: [
        {
          name,
          age,
        },
      ],
    };
  }

  throwError(): ResponseInterface {
    return {
      success: false,
      code: 1002,
      data: [],
    };
  }

  businessValidationFail(): ResponseInterface {
    return {
      code: 1003,
      httpStatusCode: 202,
      success: false,
      message: 'optional',
    };
  }
}
