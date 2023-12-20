import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { User } from '../users/entities/user.entity';
import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    currentUser: User,
    createWorkspaceInput: CreateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.prisma.workspace.create({
      data: {
        ...createWorkspaceInput,
        userId: currentUser.id,
      },
    });
  }

  async findAll(currentUser: User): Promise<Workspace[]> {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        userId: currentUser.id,
      },
    });
    return workspaces;
  }

  async findOne(currentUser: User, id: string): Promise<Workspace> {
    // Check if the workspace exists and belongs to the current user
    const existingWorkspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!existingWorkspace || existingWorkspace.userId !== currentUser.id) {
      // If the workspace is not found or doesn't belong to the current user, throw NotFoundException
      throw new NotFoundException('Workspace not found');
    }

    return existingWorkspace;
  }

  async update(
    currentUser: User,
    id: string,
    updateWorkspaceInput: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    // Check if the workspace exists and belongs to the current user
    const existingWorkspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!existingWorkspace || existingWorkspace.userId !== currentUser.id) {
      // If the workspace is not found or doesn't belong to the current user, throw NotFoundException
      throw new NotFoundException('Workspace not found');
    }

    // Update the workspace using Prisma
    return this.prisma.workspace.update({
      where: { id },
      data: updateWorkspaceInput,
    });
  }

  async remove(currentUser: User, id: string): Promise<Workspace> {
    // Check if the workspace exists and belongs to the current user
    const existingWorkspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!existingWorkspace || existingWorkspace.userId !== currentUser.id) {
      // If the workspace is not found or doesn't belong to the current user, throw NotFoundException
      throw new NotFoundException('Workspace not found');
    }

    // Remove the workspace using Prisma
    return this.prisma.workspace.delete({
      where: { id },
    });
  }
}
