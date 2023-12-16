import 'reflect-metadata';
import {
  ObjectType,
  // registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
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

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  // @Field(() => Role)
  // role: Role;

  // @Field(() => [Post], { nullable: true })
  // posts?: [Post] | null;

  @HideField()
  password: string;
}
