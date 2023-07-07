import { Test } from '@nestjs/testing';
import { FirestoreService } from './firestore.service';
import * as admin from 'firebase-admin';
import path from 'path';
import { UserDocument } from './firestore.collection';

//initialize firebase sdk with config json, in my case its firebase.json created in root folder of project
admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve(__dirname, '../../../../firebase.json'),
  ),
});

describe('FirestoreService', () => {
  let firestoreService: FirestoreService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FirestoreService],
    }).compile();

    firestoreService = moduleRef.get<FirestoreService>(FirestoreService);
  });

  describe('getRecordById', () => {
    it('should retrieve a record by id', async () => {
      // Arrange
      const collectionName = UserDocument.collectionName;
      const id = 'EbywGa09h8XYlSttXlYH';
      const mock = {
        firstName: 'G.E. Longer-Life Indoor Recessed Floodlight Bulbs',
        lastName: 'Carlos Soltero',
        sno: '6',
      };

      jest.spyOn(firestoreService, 'getRecordById').mockResolvedValueOnce(mock);

      // Act
      const result = await firestoreService.getRecordById(collectionName, id);
      // Assert
      expect(result).toEqual(mock);
    });
  });
});
