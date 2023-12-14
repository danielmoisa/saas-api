import { InputType, Field } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class SigninInput {
  /**
   * There is a bug here if I dont user @MaxLength sigininInput args are null, this works if I take each separated field
   *  */
  @Field()
  @MaxLength(255)
  email: string;

  @MaxLength(255)
  @Field()
  password: string;
}
