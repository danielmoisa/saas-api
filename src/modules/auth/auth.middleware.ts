import { Request } from 'express';
import { AuthService } from './auth.service';

export const authenticateUserByRequest = (
  authService: AuthService,
  request: Request,
) => {
  const token =
    request.headers.authorization?.replace('Bearer ', '') ||
    request.cookies.accessToken ||
    '';
  return authService.getUserFromToken(token);
};
