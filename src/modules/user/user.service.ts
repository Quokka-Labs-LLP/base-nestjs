import { Injectable } from '@nestjs/common';
import { FirestoreService } from 'src/common/firebase/firestore/firestore.service';
import { UserDocument } from 'src/common/firebase/firestore/firestore.collection';
import { DynamiclinkService } from 'src/common/firebase/dynamiclinks/dynamiclink.service';

@Injectable()
export class UserService {
  constructor(
    private firestore: FirestoreService,
    private dynamicLink: DynamiclinkService,
  ) {}
  async getUserById(id: string) {
    return await this.firestore.getRecordById(UserDocument.collectionName, id);
  }
}
