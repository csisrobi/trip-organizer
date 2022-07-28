import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Route } from '@prisma/client';
import React from 'react';
import parse from 'html-react-parser';
import Link from 'next/link';

export const TripCard = ({ route }: { route: Route }) => {
  return (
    <Link href={`/route/view/${route.id}`}>
      <Card sx={{ maxWidth: 345, maxHeight: '70%', cursor: 'pointer' }}>
        <CardHeader
          avatar={
            <Tooltip
              title={`${route.CreatorUser.lastName} ${route.CreatorUser.firstName}`}
            >
              <Avatar
                src={`/profilePictures/${route.CreatorUser.profilePicture}`}
              />
            </Tooltip>
          }
          title={route.name}
        />
        <CardMedia
          component="img"
          height="150"
          image={`/coverPhotos/${route.coverPhoto}`}
        />
        <CardContent>
          <Box sx={{ overflow: 'hidden' }}>{parse(route.description)}</Box>
        </CardContent>
        <CardActions disableSpacing></CardActions>
      </Card>
    </Link>
  );
};
