import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    // console.log(request.cookies);
    // Your logic to check for a valid accessToken in cookies
    const accessToken = request.cookies['accessToken'];

    // If the accessToken is not present or invalid, return false
    if (!accessToken) {
      return false;
    }

    return request;
  }

  private validateToken(token: string): boolean {
    // Implement your logic to validate the token here
    // This may involve decoding and verifying the signature
    // using your JWT library of choice
    // For example, you might use jsonwebtoken library:
    // const decodedToken = jwt.verify(token, 'your-secret-key');

    // Return true if the token is valid, false otherwise
    // Replace the following line with your validation logic
    return true;
  }
}
