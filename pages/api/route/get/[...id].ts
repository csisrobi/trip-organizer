import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  console.log(id);
  if (id[0] !== 'all') {
    let route;
    try {
      route = await prisma.route.findUnique({
        where: {
          id: parseInt(id[0]),
        },
        select: {
          id: true,
          track: true,
          name: true,
          description: true,
          difficulty: true,
          type: true,
          distance: true,
          length: true,
          groupTour: true,
          meetingLocation: true,
          meetingTime: true,
          stripePrice: true,
          price: true,
          startDate: true,
          endDate: true,
          maxParticipants: true,
          coverPhoto: true,
          CreatorUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
          ParticipantUsers: {
            select: {
              id: true,
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

    res.json(route);
  } else {
    let routes;
    try {
      routes = await prisma.route.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          difficulty: true,
          type: true,
          groupTour: true,
          maxParticipants: true,
          coverPhoto: true,
          CreatorUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
          ParticipantUsers: {
            select: {
              id: true,
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

    res.json(routes);
  }
};

export default get;
