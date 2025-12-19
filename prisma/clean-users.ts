import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing users and accounts
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('✅ All users deleted. Database is clean.');
  console.log('Now run: npx tsx prisma/seed-admin.ts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
