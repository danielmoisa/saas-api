import 'reflect-metadata';
import {
  ObjectType,
  // registerEnumType,
  Field,
} from '@nestjs/graphql';
import { IsDate, IsEmail } from 'class-validator';
// import { Role } from '@prisma/client';
import { BaseModel } from '../../../common/models/BaseModel';

// registerEnumType(Role, {
//   name: 'Role',
//   description: 'User role',
// });

@ObjectType()
export class User extends BaseModel {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  @IsDate()
  birthDate?: string;

  // @Field(() => Role)
  // role: Role;

  // @Field(() => [Post], { nullable: true })
  // posts?: [Post] | null;

  // @HideField()
  // password: string;
}
