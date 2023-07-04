import { Paper, Box, Typography, Stack, Button } from '@mui/material';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { joinRoute } from '../lib/mutations';

const PaymentStatus = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.replace('/'), 3000);
  }, [router]);
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: '50%',
          height: '70%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} direction="column" alignItems="center">
          <Box sx={{ backgroundColor: '#43d09a', borderRadius: '10px' }}>
            <Image src="/card.png" width="150" height="100" alt="card" />
          </Box>
          <Typography
            variant="h3"
            sx={{ color: '#43d09a', fontWeight: 'bold' }}
          >
            Thank you!
          </Typography>
          <Typography variant="h5">Payment done successfully</Typography>
          <Typography>
            You will be redirected to the home page shortly or click here to
            return to home page
          </Typography>
          {/* TODO: STYLE */}
          <Link href={'/'}>
            <Button variant="outlined" sx={{ width: '20%' }}>
              HOME
            </Button>
          </Link>
        </Stack>
      </Paper>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { success, routeId } = context.query;
  if (success === 'true') {
    await joinRoute({
      userId: session.user.id,
      routeId: parseInt(routeId as string),
    });
  }
  return { props: {} };
}

export default PaymentStatus;
