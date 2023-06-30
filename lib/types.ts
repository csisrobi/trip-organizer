export type JWTPayload = {
  id: number;
  email: string;
  time: number;
};

import { Prisma } from '@prisma/client';
export type RouteWithRelation = Prisma.RouteGetPayload<{
  include: {
    CreatorUser: true;
    ParticipantUsers: true;
    FinisherUsers: true;
    Comments: true;
  };
}>;

export type CommentsWithRelation = Prisma.CommentGetPayload<{
  include: { user: true };
}>;

export type UserWithRelation = Prisma.UserGetPayload<{
  include: {
    CreatedRoutes: true;
    JoinedRoutes: true;
    FinishedRoutes: true;
    Comments: true;
    Notifications: true;
  };
}>;
