import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirestoreService } from 'src/common/firebase/firestore/firestore.service';
import { DynamiclinkService } from 'src/common/firebase/dynamiclinks/dynamiclink.service';

@Module({
  controllers: [UserController],
  providers: [UserService, FirestoreService, DynamiclinkService],
})
export class UserModule {}
