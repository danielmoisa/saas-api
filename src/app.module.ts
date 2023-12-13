import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { MailSenderModule } from './modules/mail/mail.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './modules/users/users.module';
import { AuthService } from './modules/auth/auth.service';
import { join } from 'path/posix';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // PrismaModule.forRoot({
    //   isGlobal: true
    // }),
    AuthModule,
    MailSenderModule,
    UsersModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: (authService: AuthService) => ({
        playground: true,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        cors: {
          origin: '*',
          credentials: true,
        },
        context: async ({ req }: { req: Request }) => {
          // Later we'll load user to the context based on jwt cookie
          // const user = await authenticateUserByRequest(authService, req)
          // return { req, user }
        },
      }),
    }),
  ],
  providers: [],
})
export class AppModule {}
