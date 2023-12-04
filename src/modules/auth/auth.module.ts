import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../users/users.service';
import { MailSenderService } from '../mail/mail.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secretOrKey'),
        signOptions: {
          expiresIn: configService.getOrThrow<number>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    UserService,
    MailSenderService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
