import { Timestamp } from 'firebase-admin/firestore';

//...define your firestore collections here for ref of your code

export class UserDocument {
  static collectionName = 'users';

  firstName: string;
  lastName: string;
}

export class TodoDocument {
  static collectionName = 'todos';

  name: string;
  dueDate: Timestamp;
}
