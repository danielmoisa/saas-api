import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './modules/users/users.module';
import { AuthService } from './modules/auth/auth.service';
import { join } from 'path/posix';
import { authenticateUserByRequest } from './modules/auth/auth.middleware';
import { Request, Response } from 'express';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaModule } from './providers/prisma/prisma.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: (authService: AuthService) => ({
        introspection: true,
        playground: true,
        cors: false,
        // plugins: [ApolloServerPluginLandingPageLocalDefault()],
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context: async ({ req, res }: { req: Request; res: Response }) => {
          const user = await authenticateUserByRequest(authService, req);
          return { req, res, user };
        },
      }),
    }),
    PrismaModule,
    WorkspacesModule,
    UsersModule,
    TasksModule,
  ],
  providers: [],
})
export class AppModule {}
