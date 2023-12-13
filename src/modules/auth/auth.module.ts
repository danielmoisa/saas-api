import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  providers: [AuthResolver, AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
