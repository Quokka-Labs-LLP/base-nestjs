import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { dotenvConfig } from '@config/dotenv.config';
import { AuthResponse } from '@interfaces/Auth/response.interface';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({}), ConfigModule.forRoot(dotenvConfig())],
      providers: [AuthService]
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('auth service should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('auth()', () => {
    it('should return response with access and refresh tokens', async () => {
      const response: AuthResponse = await authService.auth("0000000000");  

      expect(response.accessToken).toBeDefined();
      expect(response.refreshToken).toBeDefined();      
    });
  });
});
