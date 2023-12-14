import { Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(currentUser: User, createWorkspaceInput: CreateWorkspaceInput) {
    return await this.prisma.workspace.create({
      data: {
        ...createWorkspaceInput,
        userId: currentUser.id,
      },
    });
  }

  async findAll(currentUser: User) {
    const workspace = await this.prisma.workspace.findMany({
      where: {
        userId: currentUser.id,
      },
    });
    return workspace;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceInput: UpdateWorkspaceInput) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
