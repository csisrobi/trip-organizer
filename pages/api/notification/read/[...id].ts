import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

const read = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.body;
  const { id } = req.query;
  if (id[0] !== 'all') {
    let notification;
    try {
      notification = await prisma.notification.update({
        where: {
          id: parseInt(id[0]),
        },
        data: {
          read: true,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400);
      res.json({ error: 'Internal error' });
      return;
    }

    res.json(notification);
  } else {
    let notifications;
    try {
      notifications = await prisma.notification.updateMany({
        where: {
          userId: parseInt(userId),
        },
        data: {
          read: true,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400);
      res.json({ error: 'Internal error' });
      return;
    }

    res.json(notifications);
  }
};

export default read;
