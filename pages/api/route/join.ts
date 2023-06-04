import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const join = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, routeId } = req.body;
  let updateUser;

  try {
    updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        JoinedRoutes: {
          create: [
            {
              route: { connect: { id: parseInt(routeId) } },
            },
          ],
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.json({ error: 'Internal error' });
    return;
  }

  res.json(updateUser);
};

export default join;
