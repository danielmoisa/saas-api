import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { Auth } from './entities/auth.entity';
import { SigninInput } from './dto/signin.input';
import { Token } from './entities/token.entity';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('signupInput') signupInput: SignupInput) {
    signupInput.email = signupInput.email.toLowerCase();
    const { accessToken, refreshToken } =
      await this.auth.createUser(signupInput);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async signin(
    @Context('req') req: Request,
    @Args('signinInput') { email, password }: SigninInput,
  ) {
    const { accessToken, refreshToken } = await this.auth.signin(
      email.toLowerCase(),
      password,
    );

    // Set HTTP-only cookies in the response
    this.auth.setCookies(req, accessToken, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
