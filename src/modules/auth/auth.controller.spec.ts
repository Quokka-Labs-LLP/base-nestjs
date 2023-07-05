import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [JwtModule.register({})],
      providers: [AuthService, ConfigService]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('Auth Controller should be defined', () => {
    expect(authController).toBeDefined();
  });

  const authResponseMock = {
    accessToken: "demoAccesstoken",
    refreshToken: "demoRefreshtoken",
  };

  const requestMock = {
    "user": {
      "phone_number": 123
    }
  }

  describe('auth()', () => {
    it('should return response with access and refresh tokens', async () => {
      jest.spyOn(authService, 'auth').mockImplementation(() => Promise.resolve(authResponseMock));

      const response: any = await authController.auth(requestMock); 

      expect(response?.success).toBe(true);
      expect(response?.status).toBe(200);
      expect(response?.message).toBe('success');
      expect(response?.data?.accessToken).toBe(authResponseMock.accessToken);
      expect(response?.data?.refreshToken).toBe(authResponseMock.refreshToken);
      
    });

    it('should call authservice.auth 1 time', async () => {
      jest.spyOn(authService, 'auth').mockImplementation(() => Promise.resolve(authResponseMock));
      await authController.auth(requestMock);
      expect(authService.auth).toHaveBeenCalledTimes(1);
    })
  });
  
  
});
