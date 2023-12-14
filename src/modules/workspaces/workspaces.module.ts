import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesResolver } from './workspaces.resolver';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Module({
  providers: [WorkspacesResolver, WorkspacesService, PrismaService],
})
export class WorkspacesModule {}
