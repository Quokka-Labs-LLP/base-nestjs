import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/models/user.schema';
import { UserProfileResponse } from './responses/userprofile.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getUserProfile(id: string): Promise<UserProfileResponse> {
    const result: any = await this.userModel.findById(id);
    if (!result) throw new NotFoundException('User profile not found');
    return {
      userId: result._id.toString(),
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
    };
  }
}
