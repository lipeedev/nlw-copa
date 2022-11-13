import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from '../lib/prisma';
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(app: FastifyInstance) {

  app.get('/me', { onRequest: [authenticate] }, async req => {
    return { user: req.user };
  });

  app.post('/users', async (req, res) => {
    const createUserBody = z.object({
      access_token: z.string()
    });

    const { access_token } = createUserBody.parse(req.body);

    const userData = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    }).then(res => res.json());

    const userInfoScheme = z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      picture: z.string().url()
    });

    const userInfo = userInfoScheme.parse(userData);

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.name,
          avatarUrl: userInfo.picture
        }
      });
    }

    const jwtSignOptions = {
      sub: user.id,
      expiresIn: '1 days'
    };

    const token = app.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl
    }, jwtSignOptions);

    return res.code(201).send({ token });

  });
}