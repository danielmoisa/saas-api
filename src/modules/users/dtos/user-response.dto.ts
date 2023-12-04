import type { User } from '@prisma/client';

export class UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string | null;
  birthDate: Date | null; // ISO Date
  registrationDate: Date; // ISO Date

  static fromUserEntity(entity: User): UserResponse {
    const response = new UserResponse();
    response.id = entity.id;
    response.firstName = entity.firstName;
    response.lastName = entity.lastName;
    response.email = entity.email;
    response.emailVerified = entity.emailVerified;
    response.image = entity.image;
    response.birthDate = entity.birthDate;
    response.registrationDate = entity.registrationDate;
    return response;
  }
}
