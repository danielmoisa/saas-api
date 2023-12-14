import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../../providers/prisma/prisma.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
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

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
