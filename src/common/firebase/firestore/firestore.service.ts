import { Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';

//this class should be used for all firestore queries
@Injectable()
export class FirestoreService {
  async getRecordById(collectionName: string, id: string) {
    const docRef = getFirestore().collection(collectionName).doc(id);
    const docSnapShot = await docRef.get();
    return docSnapShot.data();
  }
}
