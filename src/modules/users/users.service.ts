import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../../providers/prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const passwordHash = await bcrypt.hash(createUserInput?.password, 10);
    return await this.prismaService.user.create({
      data: {
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        email: createUserInput.email,
        password: {
          create: {
            hash: passwordHash,
          },
        },
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async update(
    currentUser: User,
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    // Check if the user exists and belongs to the current user
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.id !== currentUser.id) {
      // If the user is not found or doesn't belong to the current user, throw NotFoundException
      throw new NotFoundException('User not found or permissions denied');
    }

    // Update the user using Prisma
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        firstName: updateUserInput.firstName,
        lastName: updateUserInput.lastName,
        birthDate: updateUserInput.birthDate,
      },
    });

    return updatedUser;
  }

  async remove(currentUser: User, id: string): Promise<User> {
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
