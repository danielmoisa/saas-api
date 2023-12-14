import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { Me } from '../auth/me.decorator';

@UseGuards(LocalAuthGuard)
@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Mutation(() => Workspace)
  async createWorkspace(
    @Me() currentUser: User,
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.workspacesService.create(
      currentUser,
      createWorkspaceInput,
    );
  }

  @Query(() => [Workspace], { name: 'workspaces' })
  async findAll(@Me() currentUser: User): Promise<Workspace[]> {
    return await this.workspacesService.findAll(currentUser);
  }

  @Query(() => Workspace, { name: 'workspace' })
  async findOne(
    @Me() currentUser: User,
    @Args('id', { type: () => Int }) id: string,
  ): Promise<Workspace | null> {
    return await this.workspacesService.findOne(currentUser, id);
  }

  @Mutation(() => Workspace)
  async updateWorkspace(
    @Me() currentUser: User,
    @Args('updateWorkspaceInput') updateWorkspaceInput: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.workspacesService.update(
      currentUser,
      updateWorkspaceInput.id,
      updateWorkspaceInput,
    );
  }

  @Mutation(() => Workspace)
  async removeWorkspace(
    @Me() currentUser: User,
    @Args('id', { type: () => Int }) id: string,
  ): Promise<Workspace> {
    return await this.workspacesService.remove(currentUser, id);
  }
}
