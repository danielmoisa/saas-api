import { CreateWorkspaceInput } from './create-workspace.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWorkspaceInput extends PartialType(CreateWorkspaceInput) {}
