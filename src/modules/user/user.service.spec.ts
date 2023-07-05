import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../common/models/user.schema';
import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getUserProfile', () => {
    it('should return the user profile for a valid user ID', async () => {
      // Arrange
      const userId = '6486b33fcd891f8fc3134334';
      const mockUser = {
        _id: new Types.ObjectId(userId),
        email: 'iphone152@gmail.com',
        firstName: 'Iphone',
        lastName: '5',
      };

      // Mock the UserModel's findById method to return the mockUser
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);

      // Act
      const result = await service.getUserProfile(userId);

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          userId: mockUser._id.toString(),
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        }),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      // Arrange
      const userId = '6486b33fcd891f8fc3134331';

      // Mock the UserModel's findById method to return the null
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      // Act and Assert
      await expect(service.getUserProfile(userId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
