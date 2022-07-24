import { CircularProgress, Grid, Box, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { TripCard } from '../src/components/TripCard';
import prisma from '../lib/prisma';
import { Route } from '@prisma/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Home: NextPage = ({ routes }: { routes: Route[] }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid container sx={{ width: '80%', height: '80%' }}>
        {routes.map((route) => (
          <Grid key={route.id} item xs={7} lg={5} xl={3}>
            <TripCard route={route} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  try {
    const routes = await prisma.route.findMany({
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

    return {
      props: {
        routes,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }
}

export default Home;
