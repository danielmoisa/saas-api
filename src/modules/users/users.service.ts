import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../../providers/prisma/prisma.service';
import * as argon2 from 'argon2';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const passwordHash = await argon2.hash(createUserInput?.password);
    return await this.prismaService.user.create({
      data: {
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        email: createUserInput.email,
        passwordHash: passwordHash,
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
