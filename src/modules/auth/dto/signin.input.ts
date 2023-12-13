import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SigninInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  email: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  password: string;
}
