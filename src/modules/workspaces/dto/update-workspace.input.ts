import { CreateWorkspaceInput } from './create-workspace.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWorkspaceInput extends PartialType(CreateWorkspaceInput) {
  @Field()
  id: string;
}
