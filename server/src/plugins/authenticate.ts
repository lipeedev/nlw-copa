import { FastifyRequest } from "fastify";

export async function authenticate(app: FastifyRequest) {
  await app.jwtVerify();
}