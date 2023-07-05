import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpService } from './otp.service';
import { Otp } from '../../common/models/otp.schema';
// import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateOtpDto, VerifyOtpDto } from './dto/otp.dto';
import * as argon2 from 'argon2';

describe('OtpService', () => {
  let otpService: OtpService;
  let otpModel: Model<Otp>;
  // let mailService: MailService;
  let configService: ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        // MailService,
        ConfigService,
        {
          provide: getModelToken(Otp.name),
          useValue: Model,
        },
      ],
    }).compile();
    otpService = module.get<OtpService>(OtpService);
    otpModel = module.get<Model<Otp>>(getModelToken(Otp.name));
    // mailService = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createOtp', () => {
    jest.mock('argon2', () => ({
      hash: () => 'hashedPin',
    }));
    it('should create a new OTP', async () => {
      // Arrange
      const data: CreateOtpDto = { email: 'test@example.com' };
      const otpLength = 6;
      const otpExpireTime = 5; // 5 minutes
      const pin = '123456'; // A fixed pin for testing
      const expiry = new Date(
        new Date().getTime() + otpExpireTime * 60000,
      ).toISOString();
      // const hashPin = 'cdsjcnkscnkn32234';
      // jest.spyOn(argon2, 'hash').mockResolvedValue(hashPin);
      jest.spyOn(configService, 'get').mockReturnValueOnce(otpLength);
      jest.spyOn(otpService, 'generateOTP').mockResolvedValueOnce(pin);
      const findOneAndUpdateSpy = await jest
        .spyOn(otpModel, 'findOneAndUpdate')
        .mockResolvedValueOnce({
          email: data.email,
          pin: 'hashedPin',
          expiry,
        });

      // Act
      await otpService.createOtp(data);

      // Assert
      // expect(configService.get).toHaveBeenCalledWith('OTP_LENGTH');
      // expect(otpService.generateOTP).toHaveBeenCalledWith(otpLength);
      expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
        { email: data.email },
        { pin: 'hashedPin', expiry },
        { upsert: true },
      );
      expect(findOneAndUpdateSpy.mock.calls[0][0]).toEqual({
        email: data.email,
      });
      expect(findOneAndUpdateSpy.mock.calls[0][1]).toEqual({
        pin: 'hashedPin',
        expiry,
      });
      expect(findOneAndUpdateSpy.mock.calls[0][2]).toEqual({ upsert: true });
    });
  });
  describe('verifyOtp', () => {
    it('should throw NotFoundException if OTP details are not found', async () => {
      // Arrange
      const data: VerifyOtpDto = { email: 'test@example.com', pin: '123456' };
      jest.spyOn(otpModel, 'findOne').mockResolvedValueOnce(null);
      // Act & Assert
      await expect(otpService.verifyOtp(data)).rejects.toThrowError(
        NotFoundException,
      );
    });
    it('should throw ForbiddenException if the provided OTP is invalid', async () => {
      // Arrange
      const data: VerifyOtpDto = { email: 'test@example.com', pin: '123456' };
      const otpDetails = {
        email: data.email,
        pin: await argon2.hash('654321'), // Invalid OTP
        expiry: new Date(),
      };
      jest.spyOn(otpModel, 'findOne').mockResolvedValueOnce(otpDetails);
      // jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false);
      // Act & Assert
      await expect(otpService.verifyOtp(data)).rejects.toThrowError(
        ForbiddenException,
      );
    });
    it('should throw ForbiddenException if the OTP has expired', async () => {
      // Arrange
      const data: VerifyOtpDto = { email: 'test@example.com', pin: '123456' };
      const otpDetails = {
        email: data.email,
        pin: await argon2.hash(data.pin),
        expiry: new Date(new Date().getTime() - 60000), // Expired OTP
      };
      jest.spyOn(otpModel, 'findOne').mockResolvedValueOnce(otpDetails);
      // Act & Assert
      await expect(otpService.verifyOtp(data)).rejects.toThrowError(
        ForbiddenException,
      );
    });
    it('should not throw any error if the OTP is valid and not expired', async () => {
      // Arrange
      const data: VerifyOtpDto = { email: 'test@example.com', pin: '123456' };
      const otpDetails = {
        email: data.email,
        pin: await argon2.hash(data.pin),
        expiry: new Date(new Date().getTime() + 60000), // Future expiry time
      };
      jest.spyOn(otpModel, 'findOne').mockResolvedValueOnce(otpDetails);
      // jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true);
      // Act & Assert
      await expect(otpService.verifyOtp(data)).resolves.not.toThrowError();
    });
  });
  describe('generateOTP', () => {
    it('should generate an OTP of the specified length', async () => {
      // Arrange
      const otpLength = 6;
      // Act
      const otp = await otpService.generateOTP(otpLength);
      // Assert
      expect(otp.length).toBe(otpLength);
    });
  });
});
