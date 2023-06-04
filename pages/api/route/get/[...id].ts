import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (id[0] === 'pending') {
    try {
      const routes = await prisma.route.findMany({
        where: {
          approval: 'pending',
        },
        select: {
          id: true,
          name: true,
        },
      });
      res.json(routes);
      return;
    } catch (e) {
      console.log(e);
      res.status(400);
      res.json({ error: 'Internal error' });
      return;
    }
  }
  if (id[0] !== 'all' && id[0] !== 'tours') {
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
          meetingLocationX: true,
          meetingLocationY: true,
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
              userId: true,
            },
          },
          Comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              user: true,
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
    const routeLocation = {
      ...route,
      meetingLocation: [route.meetingLocationX, route.meetingLocationY],
    };
    res.json(routeLocation);
    return;
  } else {
    let routes;
    try {
      routes = await prisma.route.findMany({
        where: {
          approval: 'approved',
          ...(id[0] === 'tours' && { groupTour: false }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          difficulty: true,
          type: true,
          groupTour: true,
          maxParticipants: true,
          coverPhoto: true,
          distance: true,
          length: true,
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
              userId: true,
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
    return;
  }
};

export default get;
