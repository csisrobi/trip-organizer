import { CircularProgress, Grid, Box } from '@mui/material';
import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { TripCard } from '../src/components/TripCard';
const Home: NextPage = () => {
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
        <Grid item xs={7} lg={5} xl={3}>
          <TripCard />
        </Grid>
        <Grid item xs={7} lg={5} xl={3}>
          <TripCard />
        </Grid>
        <Grid item xs={7} lg={5} xl={3}>
          <TripCard />
        </Grid>
        <Grid item xs={7} lg={5} xl={3}>
          <TripCard />
        </Grid>
        <Grid item xs={7} lg={5} xl={3}>
          <TripCard />
        </Grid>
        <Grid item xs={7} lg={5} xl={3}>
          <TripCard />
        </Grid>
        <Grid item xs={7} lg={5} xl={3}>
          <TripCard />
        </Grid>
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

  return {
    props: { session },
  };
}

export default Home;
