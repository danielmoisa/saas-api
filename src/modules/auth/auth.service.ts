import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';
import { JwtPayload } from './jwt/jwt-payload';

import { AuthUser } from './auth-user';
import { ChangeEmailRequest } from './dtos/requests/change-email-request.dto';
import { ChangePasswordRequest } from './dtos/requests/change-password.dto';
import { LoginRequest } from './dtos/requests/login-request.dto';
import { ResetPasswordRequest } from './dtos/requests/reset-password-request.dto';
import { SignupRequest } from './dtos/requests/sign-up-request.dto';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { UserService } from '../users/users.service';
import { MailSenderService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailSenderService: MailSenderService,
  ) {}

  async signup(signupRequest: SignupRequest): Promise<void> {
    const emailVerificationToken = nanoid();

    try {
      await this.prisma.user.create({
        data: {
          email: signupRequest.email.toLowerCase(),
          passwordHash: await argon2.hash(signupRequest.password),
          firstName: signupRequest.firstName,
          lastName: signupRequest.lastName,
          emailVerification: {
            create: {
              token: emailVerificationToken,
            },
          },
        },
        select: null,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          // unique constraint
          throw new ConflictException();
        } else throw e;
      } else throw e;
    }

    await this.mailSenderService.sendVerifyEmailMail(
      signupRequest.firstName,
      signupRequest.email,
      emailVerificationToken,
    );
  }

  async resendVerificationMail(
    name: string,
    email: string,
    userId: number,
  ): Promise<void> {
    // delete old email verification tokens if exist
    const deletePrevEmailVerificationIfExist =
      this.prisma.emailVerification.deleteMany({
        where: { userId },
      });

    const token = nanoid();

    const createEmailVerification = this.prisma.emailVerification.create({
      data: {
        userId,
        token,
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevEmailVerificationIfExist,
      createEmailVerification,
    ]);

    // await this.mailSenderService.sendVerifyEmailMail(name, email, token);
  }

  async verifyEmail(token: string): Promise<void> {
    const emailVerification = await this.prisma.emailVerification.findUnique({
      where: { token },
    });

    if (
      emailVerification !== null &&
      emailVerification.validUntil > new Date()
    ) {
      await this.prisma.user.update({
        where: { id: emailVerification.userId },
        data: {
          emailVerified: true,
        },
        select: null,
      });
    } else {
      Logger.log(`Verify email called with invalid email token ${token}`);
      throw new NotFoundException();
    }
  }

  async sendChangeEmailMail(
    changeEmailRequest: ChangeEmailRequest,
    userId: number,
    name: string,
    oldEmail: string,
  ): Promise<void> {
    const emailAvailable = await this.isEmailAvailable(
      changeEmailRequest.newEmail,
    );
    if (!emailAvailable) {
      Logger.log(
        `User with id ${userId} tried to change its email to already used ${changeEmailRequest.newEmail}`,
      );
      throw new ConflictException();
    }

    const deletePrevEmailChangeIfExist = this.prisma.emailChange.deleteMany({
      where: { userId },
    });

    const token = nanoid();

    const createEmailChange = this.prisma.emailChange.create({
      data: {
        userId,
        token,
        newEmail: changeEmailRequest.newEmail,
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevEmailChangeIfExist,
      createEmailChange,
    ]);

    await this.mailSenderService.sendChangeEmailMail(name, oldEmail, token);
  }

  async changeEmail(token: string): Promise<void> {
    const emailChange = await this.prisma.emailChange.findUnique({
      where: { token },
    });

    if (emailChange !== null && emailChange.validUntil > new Date()) {
      await this.prisma.user.update({
        where: { id: emailChange.userId },
        data: {
          email: emailChange.newEmail.toLowerCase(),
        },
        select: null,
      });
    } else {
      Logger.log(`Invalid email change token ${token} is rejected.`);
      throw new NotFoundException();
    }
  }

  async sendResetPasswordMail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        firstName: true,
        email: true,
      },
    });

    if (user === null) {
      throw new NotFoundException();
    }

    const deletePrevPasswordResetIfExist = this.prisma.passwordReset.deleteMany(
      {
        where: { userId: user.id },
      },
    );

    const token = nanoid();

    const createPasswordReset = this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevPasswordResetIfExist,
      createPasswordReset,
    ]);

    // await this.mailSenderService.sendResetPasswordMail(
    //   user.firstName,
    //   user.email,
    //   token,
    // );
  }

  async resetPassword(
    resetPasswordRequest: ResetPasswordRequest,
  ): Promise<void> {
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { token: resetPasswordRequest.token },
    });

    if (passwordReset !== null && passwordReset.validUntil > new Date()) {
      await this.prisma.user.update({
        where: { id: passwordReset.userId },
        data: {
          passwordHash: await argon2.hash(resetPasswordRequest.newPassword),
        },
        select: null,
      });
    } else {
      Logger.log(
        `Invalid reset password token ${resetPasswordRequest.token} is rejected`,
      );
      throw new NotFoundException();
    }
  }

  async changePassword(
    changePasswordRequest: ChangePasswordRequest,
    userId: number,
    name: string,
    email: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash: await argon2.hash(changePasswordRequest.newPassword),
      },
      select: null,
    });

    // no need to wait for information email
    this.mailSenderService.sendPasswordChangeInfoMail(name, email);
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (user !== null && user.email === payload.email) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async login(loginRequest: LoginRequest): Promise<string> {
    const normalizedIdentifier = loginRequest.identifier.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        email: normalizedIdentifier,
      },
      select: {
        id: true,
        passwordHash: true,
        email: true,
      },
    });

    if (!user) throw new UnauthorizedException();

    const match = await argon2.verify(user.passwordHash, loginRequest.password);

    if (!match) throw new UnauthorizedException();

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { email: true },
    });
    return user === null;
  }
}
