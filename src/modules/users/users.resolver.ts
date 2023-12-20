import {
  Resolver,
  Query,
  Parent,
  Mutation,
  Args,
  ResolveField,
} from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UsersService } from './users.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { Me } from '../../common/decorators/me.decorator';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Me() user: User,
    @Args('data') newUserData: UpdateUserInput,
  ) {
    return this.usersService.updateUser(user, newUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @Me() user: User,
    @Args('data') changePassword: ChangePasswordInput,
  ) {
    const userPassword = await this.prisma.password.findUnique({
      where: { userId: user.id },
    });

    if (!userPassword) throw new NotFoundException('User password not found');

    return this.usersService.changePassword(
      user.id,
      userPassword?.hash,
      changePassword,
    );
  }

  // @ResolveField('posts')
  // posts(@Parent() author: User) {
  //   return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  // }
}
