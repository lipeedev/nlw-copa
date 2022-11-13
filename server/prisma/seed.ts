import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@gmail.com',
      avatarUrl: 'https://github.com/1Leep.png'
    }
  });

  const pool = await prisma.pool.create({
    data: {
      title: 'Example pool',
      code: 'LEEP13',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    }
  });

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.700Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  });

  await prisma.game.create({
    data: {
      date: '2022-11-03T13:00:00.700Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                poolId: pool.id,
                userId: user.id
              }
            }
          }
        }
      }
    }
  });

})();