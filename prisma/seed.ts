import { tasksMock } from './mocks/tasksMock';
import { PrismaClient } from '@prisma/client';
import { cleanupDb, createUser, createPassword } from '../src/utils/db-utils';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding...');

  console.time(`🌱 Database has been seeded`);

  console.time('🧹 Cleaned up the database...');

  await cleanupDb(prisma);

  console.timeEnd('🧹 Cleaned up the database...');

  console.time('🔑 Created permissions...');

  const totalUsers = 5;

  console.time(`👤 Created ${totalUsers} users...`);

  for (let index = 0; index < totalUsers; index++) {
    const userData = createUser();

    await prisma.user

      .create({
        select: { id: true },

        data: {
          ...userData,
          password: { create: createPassword(userData.email) },
        },
      })

      .catch((e) => {
        console.error('Error creating a user:', e);

        return null;
      });
  }

  console.timeEnd(`👤 Created ${totalUsers} users...`);

  console.time(`🐨 Created admin user "kody"`);

  await prisma.user.create({
    select: { id: true },

    data: {
      email: 'kody@gmail.com',
      firstName: 'Cool',
      lastName: 'Kody',
      password: { create: createPassword('kodylovesyou') },
      workspaces: {
        create: [
          {
            id: '1123d345345r34tv4vt54',
            name: 'Progression.io',
            tasks: {
              create: tasksMock,
            },
          },
        ],
      },
    },
  });

  console.timeEnd(`🐨 Created admin user "Kody"`);

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
