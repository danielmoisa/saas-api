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
import { Request } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // PrismaModule.forRoot({
    //   isGlobal: true
    // }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule, UsersModule],
      inject: [AuthService],
      useFactory: (authService: AuthService) => ({
        playground: true,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        cors: {
          origin: '*',
          credentials: true,
        },
        context: async ({ req }: { req: Request }) => {
          const user = await authenticateUserByRequest(authService, req);
          return { req, user };
        },
      }),
    }),
  ],
  providers: [],
})
export class AppModule {}
