import { Route } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const end = async (req: NextApiRequest, res: NextApiResponse) => {
  const { routeId } = req.body;
  let updateRoute;

  try {
    updateRoute = await prisma.route.update({
      where: { id: routeId },
      data: {
        approval: 'ended',
      },
    });
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      select: {
        ParticipantUsers: true,
      },
    });
    const connectIDs = route.ParticipantUsers.map((pu) => ({
      user: {
        connect: { id: pu.userId },
      },
    }));
    updateRoute = await prisma.route.update({
      where: { id: routeId },
      data: {
        FinisherUsers: {
          create: connectIDs,
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.json({ error: 'Internal error' });
    return;
  }

  res.json(updateRoute);
};

export default end;
