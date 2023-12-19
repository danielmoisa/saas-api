import { Prisma, User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { SignupInput } from './dto/signup.input';
import { Token } from './entities/token.entity';
import { SecurityConfig } from '../../config/configuration.interface';
import { PasswordService } from '../../providers/password/password.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(signupInput: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      signupInput.password,
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: signupInput.firstName,
          lastName: signupInput.lastName,
          email: signupInput.email,
          password: {
            create: {
              hash: hashedPassword,
            },
          },
        },
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${signupInput.email} already used.`);
      }
      throw new Error(e);
    }
  }

  async signin(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const userPassword = await this.prisma.password.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userPassword) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      userPassword.hash,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({
      userId: user?.id,
    });
  }

  async validateUser(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserFromToken(token: string) {
    if (token) {
      const data = this.jwtService.decode(token);
      if (data && data?.userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: data.userId },
        });

        return user || null;
      }
    }
    return null;
  }

  // async me(token: string): Promise<User | null> {
  //   if (token) {
  //     const data = this.jwtService.decode(token, { json: true }) as {
  //       sub: unknown;
  //     };
  //     if (data?.sub && typeof data?.sub) {
  //       const user = await this.prisma.user.findUnique({
  //         where: { id: String(data.sub) },
  //       });
  //       return user || null;
  //     }
  //   }
  //   return null;
  // }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig?.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  setCookies(req: Request, accessToken: string, refreshToken: string) {
    // Set cookies in the response object
    req.res?.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 10000,
      sameSite: 'none',
      // secure: true, //on HTTPS
      // domain: 'example.com', //set your domain
    });
    // req.res?.cookie('refreshToken', refreshToken, { httpOnly: true });
  }
}
