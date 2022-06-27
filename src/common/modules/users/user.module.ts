// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
 
// @Module({
//   imports: [TypeOrmModule.forFeature([User])],
//   controllers: [UserController],
//   providers: [UserService],
// })
// export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controlller';
import User from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
