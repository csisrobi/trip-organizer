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
import {
  MdKayaking,
  MdDirectionsRun,
  MdStarRate,
  MdGroups,
} from 'react-icons/md';
import Image from 'next/image';
import { mToKm } from '../../../utils/mToKm';
import { mToH } from '../../../utils/mToH';
import { mToRestM } from '../../../utils/mToRestM';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  return (
    <Link href={`/route/view/${route.id}`}>
      <Card sx={{ maxWidth: 345, height: 320, cursor: 'pointer' }}>
        <CardHeader
          sx={{
            '	.MuiCardHeader-action': { marginTop: '2px', marginRight: '0px' },
          }}
          titleTypographyProps={{
            sx: {
              fontWeight: 'bold',
              fontSize: '20px',
            },
          }}
          avatar={
            <Tooltip
              title={`${route.CreatorUser.lastName} ${route.CreatorUser.firstName}`}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile/${route.CreatorUser.id}`);
              }}
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
          action={route.groupTour ? <MdGroups fontSize="35px" /> : undefined}
          title={route.name}
        />
        <CardMedia
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
                <Typography>{mToKm(route.distance).toFixed(1)}km</Typography>
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
                  {`${mToH(route.length)}:${mToRestM(route.length)}-${
                    mToH(route.length) + 1
                  }:${mToRestM(route.length)}h`}
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
