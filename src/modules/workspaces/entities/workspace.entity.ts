import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Workspace {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  name: string;

  @Field(() => String)
  userId: string;
}
