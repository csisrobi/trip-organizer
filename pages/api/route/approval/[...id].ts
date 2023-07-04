import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { RouteWithRelation } from '../../../../lib/types';

const approval = async (req: NextApiRequest, res: NextApiResponse) => {
  const { approved } = req.body;
  const { id } = req.query;
  let route;
  try {
    const approval = approved ? 'approved' : 'rejected';
    route = await prisma.route.update({
      where: {
        id: parseInt(id[0]),
      },
      data: {
        approval,
      },
    });
    console.log(route);
    await prisma.notification.create({
      data: {
        content: `${route.name} creation was ${approval}`,
        user: { connect: { id: parseInt(route.userId) } },
        read: false,
        redirectLocation: `/route/view/${route.id}`,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.json({ error: 'Internal error' });
    return;
  }

  res.json(route);
};

export default approval;
