import { type PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { UniqueEnforcer } from 'enforce-unique';
import * as bcrypt from 'bcryptjs';

export async function cleanupDb(prisma: PrismaClient) {
  const tables = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma_migrations';`;

  await prisma.$transaction([
    // Disable FK constraints to avoid relation conflicts during deletion
    prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`), // Disable triggers and constraints temporarily

    // Delete all rows from each table, preserving table structures
    ...tables.map(({ tablename }) =>
      prisma.$executeRawUnsafe(`DELETE FROM "${tablename}";`),
    ),

    prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`), // Re-enable triggers and constraints
  ]);
}

const uniqueUsernameEnforcer = new UniqueEnforcer();

export function createUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const username = uniqueUsernameEnforcer
    .enforce(() => {
      return (
        faker.string.alphanumeric({ length: 2 }) +
        '_' +
        faker.internet.userName({
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
        })
      );
    })
    .slice(0, 20)
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_');
  return {
    firstName,
    lastName,
    email: `${username}@example.com`,
  };
}

export function createPassword(password: string = faker.internet.password()) {
  return {
    hash: bcrypt.hashSync(password, 10),
  };
}
