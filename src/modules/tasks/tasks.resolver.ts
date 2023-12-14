import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { Me } from '../auth/me.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(LocalAuthGuard)
@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  async createTask(
    @Me() currentUser: User,
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ) {
    return await this.tasksService.create(currentUser, createTaskInput);
  }

  @Query(() => [Task], { name: 'tasks' })
  async findAll(
    @Me() currentUser: User,
    @Args('workspaceId') workspaceId: string,
  ) {
    return await this.tasksService.findAll(currentUser, workspaceId);
  }

  @Query(() => Task, { name: 'task' })
  async findOne(
    @Me() currentUser: User,
    @Args('taskId', { type: () => Int }) taskId: string,
  ) {
    return await this.tasksService.findOne(currentUser, taskId);
  }

  @Mutation(() => Task)
  async updateTask(
    @Me() currentUser: User,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ) {
    return await this.tasksService.update(
      currentUser,
      updateTaskInput.id,
      updateTaskInput,
    );
  }

  @Mutation(() => Task)
  async removeTask(
    @Me() currentUser: User,
    @Args('taskId', { type: () => Int }) taskId: string,
  ) {
    return await this.tasksService.remove(currentUser, taskId);
  }
}
