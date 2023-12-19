import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    // Check for a valid accessToken in cookies
    const accessToken = request?.cookies['accessToken'];

    // If the accessToken is not present or invalid, return false
    if (!accessToken) {
      return false;
    }

    return request;
  }
}
