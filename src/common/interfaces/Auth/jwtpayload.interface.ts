import { ObjectId } from 'mongoose';

export interface JwtPayload {
  // Degine the properties you need in the payload
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  //... other properties
}
