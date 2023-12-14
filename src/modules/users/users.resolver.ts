import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { Me } from '../auth/me.decorator';

@UseGuards(LocalAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User | null> {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Me() currentUser: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.usersService.update(
      currentUser,
      updateUserInput.id,
      updateUserInput,
    );
  }

  @Mutation(() => User)
  async removeUser(
    @Me() currentUser: User,
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return await this.usersService.remove(currentUser, id);
  }
}
