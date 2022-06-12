import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from './prisma';
import { JWTPayload } from './types';

export const validateRoute = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { ORGANIZER_ACCESS_TOKEN: token } = req.cookies;

    if (token) {
      let user;

      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
        user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          throw new Error('Not real user');
        }
      } catch (error) {
        res.status(401);
        res.json({ error: 'Not Authorizied' });
        return;
      }

      return handler(req, res, user);
    }

    res.status(401);
    res.json({ error: 'Not Authorizied' });
  };
};
