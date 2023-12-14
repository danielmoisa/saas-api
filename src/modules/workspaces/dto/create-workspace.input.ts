import { InputType, Field } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateWorkspaceInput {
  @Field()
  @MaxLength(255)
  name: string;
}
