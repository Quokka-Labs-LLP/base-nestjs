import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../models/user.schema';

/**
 *
 */
@Injectable()
export class UserDao {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findUserById = (id: Types.ObjectId, params: any): Promise<any> => {
    return this.userModel.findById(id).select(params).exec();
  };
}
