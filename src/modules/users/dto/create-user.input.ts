import { InputType, Field } from '@nestjs/graphql';
import { MaxLength, IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @Field()
  @MaxLength(255)
  password: string;

  @Field()
  @MaxLength(255)
  firstName: string;

  @Field()
  @MaxLength(255)
  lastName: string;
}
