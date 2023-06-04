import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

const approval = async (req: NextApiRequest, res: NextApiResponse) => {
  const { approved } = req.body;
  const { id } = req.query;
  let route;
  try {
    route = await prisma.route.update({
      where: {
        id: parseInt(id[0]),
      },
      data: {
        approval: approved ? 'approved' : 'rejected',
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
