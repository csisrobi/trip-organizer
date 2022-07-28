import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (id[0] === 'undefined') {
    res.status(404);
    res.json({ error: 'User not found' });
    return;
  }
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: parseInt(id[0]),
      },
      select: {
        id: true,
        profilePicture: true,
        lastName: true,
        firstName: true,
        role: true,
        Notifications: {
          select: {
            id: true,
            createdAt: true,
            content: true,
            read: true,
            redirectLocation: true,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.json({ error: 'Internal error' });
    return;
  }

  res.json(user);
};

export default get;
