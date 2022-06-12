import { CircularProgress, Grid } from '@mui/material';
import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
const Home: NextPage = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  if (status === 'loading') {
    return <CircularProgress />;
  }

  return <Grid></Grid>;
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);
  return {
    props: { session },
  };
}

export default Home;
