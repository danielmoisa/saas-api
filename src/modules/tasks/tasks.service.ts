import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { User } from '../users/entities/user.entity';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    currentUser: User,
    createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    // Check if the workspace belongs to the current user
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: createTaskInput.workspaceId,
      },
    });

    if (!workspace || workspace.userId !== currentUser.id) {
      // If the workspace is not found or doesn't belong to the current user, throw NotFoundException
      throw new NotFoundException('Workspace not found or permissions denied');
    }

    // Create a new task for the given workspace
    const createdTask = await this.prisma.task.create({
      data: {
        title: createTaskInput.title,
        content: createTaskInput.content,
        label: createTaskInput.label,
        priority: createTaskInput.priority,
        status: createTaskInput.status,
        workspace: {
          connect: {
            id: createTaskInput.workspaceId,
          },
        },
      },
    });

    return createdTask;
  }
  async findAll(currentUser: User, workspaceId: string) {
    // Check if the workspace belongs to the current user
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });

    if (!workspace || workspace.userId !== currentUser.id) {
      // If the workspace is not found or doesn't belong to the current user, throw NotFoundException
      throw new NotFoundException('Workspace not found or permissions denied');
    }

    // Find all tasks for the given workspace
    const tasks = await this.prisma.task.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });

    return tasks;
  }

  async findOne(currentUser: User, taskId: string) {
    // Find the task using Prisma and include its workspace
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { workspace: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if the task belongs to any workspace of the current user
    const workspacesForCurrentUser = await this.prisma.workspace.findMany({
      where: {
        userId: currentUser.id,
      },
      select: {
        tasks: {
          select: { id: true },
        },
      },
    });

    const taskIdsForCurrentUser = workspacesForCurrentUser.flatMap(
      (workspace) => workspace.tasks.map((task) => task.id),
    );

    if (!taskIdsForCurrentUser.includes(taskId)) {
      throw new ForbiddenException(
        'You do not have permission to access this task',
      );
    }

    return task;
  }

  async update(
    currentUser: User,
    taskId: string,
    updateTaskInput: UpdateTaskInput,
  ) {
    // Check if the task exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { workspace: { select: { userId: true } } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if the task belongs to the current user
    if (task.workspace?.userId !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to update this task',
      );
    }

    // Update the task using Prisma
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: updateTaskInput,
    });

    return updatedTask;
  }

  async remove(currentUser: User, taskId: string) {
    // Check if the task exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { workspace: { select: { userId: true } } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if the task belongs to the current user
    if (task.workspace?.userId !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to remove this task',
      );
    }

    // Remove the task using Prisma
    const removedTask = await this.prisma.task.delete({
      where: { id: taskId },
    });

    return removedTask;
  }
}
