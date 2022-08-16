import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Route } from '@prisma/client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { GiHiking, GiMountainClimbing, GiCycling } from 'react-icons/gi';
import { MdKayaking, MdDirectionsRun, MdStarRate } from 'react-icons/md';
import Image from 'next/image';

export const TripCard = ({ route }: { route: Route }) => {
  const { t } = useTranslation();

  const TypeIcon = () => {
    switch (route.type) {
      case 'hiking':
        return <GiHiking />;
      case 'kayaking':
        return <MdKayaking />;
      case 'cycling':
        return <GiCycling />;
      case 'running':
        return <MdDirectionsRun />;
      case 'viaferrata':
        return <GiMountainClimbing />;
      default:
        return <></>;
    }
  };

  const DifficultyIcon = () => {
    switch (route.difficulty) {
      case 'easy':
        return <MdStarRate />;
      case 'medium':
        return (
          <Box>
            <MdStarRate />
            <MdStarRate />
          </Box>
        );
      case 'hard':
        return (
          <Box>
            <MdStarRate />
            <MdStarRate />
            <MdStarRate />
          </Box>
        );
      default:
        return <></>;
    }
  };

  return (
    <Link href={`/route/view/${route.id}`}>
      <Card sx={{ maxWidth: 345, height: 320, cursor: 'pointer' }}>
        <CardHeader
          avatar={
            <Tooltip
              title={`${route.CreatorUser.lastName} ${route.CreatorUser.firstName}`}
            >
              <Avatar>
                <Image
                  src={`/profilePictures/${route.CreatorUser.profilePicture}`}
                  alt="profile"
                  layout="fill"
                />
              </Avatar>
            </Tooltip>
          }
          title={route.name}
        />
        <CardMedia
          sx={{ border: '0.5px solid black' }}
          component="img"
          height="150"
          image={`/coverPhotos/${route.coverPhoto}`}
        />
        <CardContent sx={{ padding: '12px' }}>
          <Box>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>{t('diff')}</Typography>
                <DifficultyIcon />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('distance')}
                </Typography>
                <Typography>
                  {(parseInt(route.distance) / 1000).toFixed(1)}km
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('duration')}
                </Typography>
                <Typography>
                  {`${Math.floor(parseInt(route.length) / 60)}:${
                    parseInt(route.length) % 60
                  } - ${Math.floor(parseInt(route.length) / 60) + 1}:${
                    parseInt(route.length) % 60
                  } h`}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>{t('type')}</Typography>
                <TypeIcon />
              </Box>
            </Stack>
          </Box>
        </CardContent>
        <CardActions disableSpacing></CardActions>
      </Card>
    </Link>
  );
};
