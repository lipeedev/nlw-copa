import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(app: FastifyInstance) {

  app.get('/pools/:id/games', { onRequest: [authenticate] }, async req => {
    const getPoolParam = z.object({
      id: z.string()
    });

    const { id: poolId } = getPoolParam.parse(req.params);

    let games = await prisma.game.findMany({
      orderBy: { date: 'desc' },
      include: {
        guesses: {
          where: {
            participant: { userId: req.user.sub, poolId }
          }
        }
      }
    });

    return {
      games: games.map(game => ({
        ...game,
        guess: game.guesses.length ? game.guesses[0] : null,
        guesses: undefined
      }))
    };
  });
}