import { Paper, Box, Typography, Stack, Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { joinRoute } from '../lib/mutations';

const PaymentStatus = () => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (router.query.success === 'true') {
      (async () => {
        await joinRoute({
          userId: session.user.id,
          routeId: parseInt(router.query.routeId as string),
        });
      })();
    }
  }, [router, session]);

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

export default PaymentStatus;
