import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import { SigninInput } from './dto/signin.input';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signinLocal(
    @Args('signinInput') signinInput: SigninInput,
    @Context('req') req: Request,
  ): Promise<{ token: string }> {
    const { token } = await this.authService.signinLocal(signinInput);
    req.res?.cookie('jwt', token, { httpOnly: true });
    return { token };
  }

  @Mutation(() => User)
  async signOut(
    @Context('req') req: Request,
    @Context('user') user: User,
  ): Promise<User> {
    req.res?.clearCookie('jwt', { httpOnly: true });
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Query(() => User)
  async me(@Context('user') user: User): Promise<User> {
    return user;
  }
}
