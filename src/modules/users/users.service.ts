import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { User } from './entities/user.entity';
import { ChangePasswordInput } from './dto/change-password.input';
import { PasswordService } from '../../providers/password/password.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async updateUser(currentUser: User, updateUserInput: UpdateUserInput) {
    // Check if the user exists and belongs to the current user
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!existingUser || existingUser.id !== currentUser.id) {
      // If the user is not found or doesn't belong to the current user, throw NotFoundException
      throw new NotFoundException('User not found or permissions denied');
    }

    // Update the user using Prisma
    const updatedUser = await this.prismaService.user.update({
      where: { id: currentUser.id },
      data: {
        firstName: updateUserInput.firstName,
        lastName: updateUserInput.lastName,
      },
    });

    return updatedUser;
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    return this.prismaService.user.update({
      data: {
        password: { update: { hash: hashedPassword } },
      },
      where: { id: userId },
    });
  }

  async remove(currentUser: User, id: string) {
    // Check if the user exists and belongs to the current user
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.id !== currentUser.id) {
      // If the user is not found or doesn't belong to the current user, throw NotFoundException
      throw new NotFoundException('User not found or permissions denied');
    }

    return await this.prismaService.user.delete({ where: { id } });
  }
}
