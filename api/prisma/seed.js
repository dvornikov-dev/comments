import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const message =
  // eslint-disable-next-line max-len
  '{"blocks":[{"key":"637gr","text":"PRIVET","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

const array = [
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
  { message },
];
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'Test@prisma.io' },
    update: {},
    create: {
      email: 'Test@prisma.io',
      username: 'Test',
      homeUrl: 'https://google.com',
      comments: {
        create: array,
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
