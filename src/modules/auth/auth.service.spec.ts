import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import * as argon2 from 'argon2';

import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';

import { User } from '../../common/models/user.schema';

import { Otp } from '../../common/models/otp.schema';

import { SignupDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';

import { OtpService } from '../otp/otp.service';

jest.mock('argon2', () => ({
  hash: () => 'hashedPassword',
}));

describe('AuthService', () => {
  let authService: AuthService;

  let userModel: Model<User>;

  let jwtService: JwtService;

  let configService: ConfigService;

  let otpService: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        JwtService,

        ConfigService,

        OtpService,

        {
          provide: getModelToken(User.name),

          useValue: Model,
        },
        {
          provide: getModelToken(Otp.name),
          useValue: Model,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    userModel = module.get<Model<User>>(getModelToken(User.name));

    jwtService = module.get<JwtService>(JwtService);

    configService = module.get<ConfigService>(ConfigService);

    otpService = module.get<OtpService>(OtpService);
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      // Arrange

      const data: SignupDto = {
        email: 'test@example.com',

        password: 'password123',

        firstName: 'John',

        lastName: 'Doe',
      };

      const hashedPassword = 'hashedPassword';

      const createdUser = {
        _id: 'userId',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      const createSpy = jest
        .spyOn(userModel, 'create')
        .mockResolvedValue(createdUser as any);

      // Act

      await authService.signup(data);

      expect(createSpy).toHaveBeenCalledWith({
        email: data.email,

        password: hashedPassword,

        firstName: data.firstName,

        lastName: data.lastName,
      });
    });
  });

  //   describe('login', () => {
  //     it('should log in the user and return access and refresh tokens', async () => {
  //       // Arrange

  //       const data: LoginDto = {
  //         email: 'test@example.com',

  //         password: 'password123',
  //       };

  //       const user = {
  //         _id: 'userId',

  //         email: 'test@example.com',

  //         firstName: 'John',

  //         lastName: 'Doe',

  //         password: 'hashedPassword',
  //       };

  //       const verifySpy = jest
  //         .spyOn(argon2, 'verify')
  //         .mockResolvedValueOnce(true);

  //       jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);

  //       jest.spyOn(authService, 'generateTokens').mockResolvedValueOnce({
  //         accessToken: 'accessToken',

  //         refreshToken: 'refreshToken',

  //         hashedRefreshToken: 'hashedRefreshToken',
  //       });

  //       const findByIdAndUpdateSpy = jest

  //         .spyOn(userModel, 'findByIdAndUpdate')

  //         .mockResolvedValueOnce({});

  //       // Act

  //       const result = await authService.login(data);

  //       // Assert

  //       expect(verifySpy).toHaveBeenCalledWith(user.password, data.password);

  //       expect(userModel.findOne).toHaveBeenCalledWith({ email: data.email });

  //       expect(authService.generateTokens).toHaveBeenCalledWith({
  //         userId: user._id.toString(),

  //         email: user.email,

  //         firstName: user.firstName,

  //         lastName: user.lastName,
  //       });

  //       expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(user._id, {
  //         refreshToken: 'hashedRefreshToken',
  //       });

  //       expect(result).toEqual({
  //         userId: user._id.toString(),

  //         email: user.email,

  //         firstName: user.firstName,

  //         lastName: user.lastName,

  //         accessToken: 'accessToken',

  //         refreshToken: 'refreshToken',
  //       });
  //     });

  //     it('should throw an UnauthorizedException if login credentials are invalid', async () => {
  //       // Arrange

  //       const data: LoginDto = {
  //         email: 'test@example.com',

  //         password: 'wrongPassword',
  //       };

  //       jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

  //       // Act & Assert

  //       await expect(authService.login(data)).rejects.toThrowError(
  //         UnauthorizedException,
  //       );
  //     });
  //   });

  //   describe('refreshTokens', () => {
  //     it('should refresh the access token for a valid user and refresh token', async () => {
  //       // Arrange

  //       const userId = 'userId';

  //       const refreshToken = 'refreshToken';

  //       const user = {
  //         _id: 'userId',

  //         email: 'test@example.com',

  //         firstName: 'John',

  //         lastName: 'Doe',

  //         refreshToken: 'hashedRefreshToken',
  //       };

  //       jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);

  //       jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true);

  //       jest.spyOn(authService, 'generateTokens').mockResolvedValueOnce({
  //         accessToken: 'newAccessToken',
  //         refreshToken: 'newRefere',
  //         hashedRefreshToken: 'hasdasfdsf',
  //       });

  //       // Act

  //       const result = await authService.refreshTokens(userId, refreshToken);

  //       // Assert

  //       expect(userModel.findById).toHaveBeenCalledWith(userId);

  //       expect(argon2.verify).toHaveBeenCalledWith(
  //         user.refreshToken,

  //         refreshToken,
  //       );

  //       expect(authService.generateTokens).toHaveBeenCalledWith({
  //         userId,

  //         email: user.email,

  //         firstName: user.firstName,

  //         lastName: user.lastName,
  //       });

  //       expect(result).toBe('newAccessToken');
  //     });

  //     it('should throw a ForbiddenException for an invalid refresh token', async () => {
  //       // Arrange

  //       const userId = 'userId';

  //       const refreshToken = 'invalidToken';

  //       const user = {
  //         _id: 'userId',

  //         email: 'test@example.com',

  //         firstName: 'John',

  //         lastName: 'Doe',

  //         refreshToken: 'hashedRefreshToken',
  //       };

  //       jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);

  //       jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false);

  //       // Act & Assert

  //       await expect(
  //         authService.refreshTokens(userId, refreshToken),
  //       ).rejects.toThrowError(ForbiddenException);
  //     });
  //   });

  //   describe('forgotPassword', () => {
  //     it('should create an OTP for the provided email', async () => {
  //       // Arrange

  //       const email = 'test@example.com';

  //       const findOneSpy = jest

  //         .spyOn(userModel, 'findOne')

  //         .mockResolvedValueOnce({});

  //       const createOtpSpy = jest
  //         .spyOn(otpService, 'createOtp')
  //         .mockResolvedValueOnce();

  //       // Act

  //       await authService.forgotPassword(email);

  //       // Assert

  //       expect(userModel.findOne).toHaveBeenCalledWith({ email });

  //       expect(otpService.createOtp).toHaveBeenCalledWith({ email });
  //     });

  //     it('should throw a NotFoundException if the user with the provided email is not found', async () => {
  //       // Arrange

  //       const email = 'test@example.com';

  //       jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

  //       // Act & Assert

  //       await expect(authService.forgotPassword(email)).rejects.toThrowError(
  //         NotFoundException,
  //       );
  //     });
  //   });

  //   describe('resetPassword', () => {
  //     it('should reset the user password for the provided email and pin', async () => {
  //       // Arrange

  //       const data: ResetPasswordDto = {
  //         email: 'test@example.com',

  //         password: 'newPassword123',

  //         pin: '123456',
  //       };

  //       const user = {
  //         email: 'test@example.com',
  //         firstName: 'test',
  //         lastName: 'ram',
  //       };

  //       jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);

  //       jest.spyOn(otpService, 'verifyOtp').mockResolvedValueOnce();

  //       const hashSpy = jest
  //         .spyOn(argon2, 'hash')
  //         .mockResolvedValueOnce('5675756456');

  //       const findOneAndUpdateSpy = jest
  //         .spyOn(userModel, 'findOneAndUpdate')
  //         .mockResolvedValueOnce({});

  //       // Act

  //       await authService.resetPassword(data);

  //       // Assert

  //       expect(userModel.findOne).toHaveBeenCalledWith({ email: data.email });

  //       expect(otpService.verifyOtp).toHaveBeenCalledWith({
  //         email: data.email,

  //         pin: data.pin,
  //       });

  //       expect(argon2.hash).toHaveBeenCalledWith(data.password);

  //       expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
  //         { email: data.email },

  //         { password: expect.any(String) },

  //         { upsert: true },
  //       );
  //     });

  //     it('should throw a NotFoundException if the user with the provided email is not found', async () => {
  //       // Arrange

  //       const data: ResetPasswordDto = {
  //         email: 'test@example.com',

  //         password: 'newPassword123',

  //         pin: '123456',
  //       };

  //       jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

  //       // Act & Assert

  //       await expect(authService.resetPassword(data)).rejects.toThrowError(
  //         NotFoundException,
  //       );
  //     });
  //   });

  //   describe('generateTokens', () => {
  //     it('should generate access and refresh tokens for the given payload', async () => {
  //       // Arrange

  //       const payload = {
  //         userId: 'userId',

  //         email: 'test@example.com',

  //         firstName: 'John',

  //         lastName: 'Doe',
  //       };

  //       jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('accessToken');

  //       jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('refreshToken');

  //       jest.spyOn(argon2, 'hash').mockResolvedValueOnce('hashedRefreshToken');

  //       // Act

  //       const result = await authService.generateTokens(payload);

  //       // Assert

  //       expect(jwtService.signAsync).toHaveBeenNthCalledWith(
  //         1,

  //         payload,

  //         expect.objectContaining({
  //           secret: configService.get<string>('JWT_SECRET'),

  //           expiresIn: configService.get('JWT_TOKEN_EXPIRATION'),
  //         }),
  //       );

  //       expect(jwtService.signAsync).toHaveBeenNthCalledWith(
  //         2,

  //         payload,

  //         expect.objectContaining({
  //           secret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),

  //           expiresIn: configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
  //         }),
  //       );

  //       expect(argon2.hash).toHaveBeenCalledWith('refreshToken');

  //       expect(result).toEqual({
  //         accessToken: 'accessToken',

  //         refreshToken: 'refreshToken',

  //         hashedRefreshToken: 'hashedRefreshToken',
  //       });
  //     });
  //   });
});
