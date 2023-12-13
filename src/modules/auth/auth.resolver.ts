import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import { SigninInput } from './dto/signin.input';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signinLocal(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
    @Context('req') req: Request,
  ) {
    const signinInput = { email, password };
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

  @UseGuards(AuthGuard)
  @Query(() => User)
  async me(@Context('user') user: User): Promise<User> {
    return user;
  }
}
