import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const comment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, routeId, content } = req.body;
  let createComment;

  try {
    createComment = await prisma.comment.create({
      data: {
        content,
        user: { connect: { id: parseInt(userId) } },
        Route: { connect: { id: parseInt(routeId) } },
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.json({ error: 'Internal error' });
    return;
  }

  res.json(createComment);
};

export default comment;
