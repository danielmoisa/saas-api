import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SigninInput } from './dto/signin.input';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signinLocal(signinInput: SigninInput): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: signinInput?.email },
      include: { password: true },
    });
    if (user && user.password) {
      const passwordMatch = await bcrypt.compare(
        signinInput.password,
        user?.password?.hash,
      );
      if (passwordMatch) {
        const token = this.jwtService.sign(
          { sub: user.id },
          { expiresIn: '30 days' },
        );
        return { token };
      }
    }
    throw new Error('Email or password is incorrect');
  }

  async me(token: string): Promise<User | null> {
    if (token) {
      const data = this.jwtService.decode(token, { json: true }) as {
        sub: unknown;
      };
      if (data?.sub && typeof data?.sub) {
        const user = await this.prisma.user.findUnique({
          where: { id: String(data.sub) },
        });
        return user || null;
      }
    }
    return null;
  }
}
