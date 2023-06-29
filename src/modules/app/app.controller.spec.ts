import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('home', () => {
    it('should return "Hello World!"', async () => {
      const response = await appController.getHello();
      expect(response.message).toBe('Hello World!');
    });
  });

  describe('healthcheck', () => {
    it('should return "Server up & running"', async () => {
      const response = await appController.healthCheck();
      expect(response.message).toBe('Server up & running');
    });
  });
});
