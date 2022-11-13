import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import 'dotenv/config';
import fastify from 'fastify';
import { authRoutes, gameRoutes, guessRoutes, poolRoutes, userRoutes } from './routes';

(async () => {
  const app = fastify({ logger: true });

  await app.register(fastifyJwt, { secret: process.env.JWT_SECRET });
  await app.register(cors, { origin: true });

  app.register(poolRoutes);
  app.register(guessRoutes);
  app.register(userRoutes);
  app.register(authRoutes);
  app.register(gameRoutes);

  await app.listen({ port: 3333, host: '0.0.0.0' });
})();
