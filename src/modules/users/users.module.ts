import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PasswordService } from '../../providers/password/password.service';

@Module({
  providers: [UsersResolver, UsersService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
