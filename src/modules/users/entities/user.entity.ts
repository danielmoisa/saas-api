import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field(() => String, { description: 'Example field (placeholder)' })
  firstName: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  lastName: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  email: string;
}
