import React, { useEffect } from 'react';
import { Paper, Box } from '@mui/material';
import { AuthComponent } from '../src/components/Auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [router, session]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${'./tripBG.jpg'})`,
        height: '100vh',
        width: '100vw',
        backgroundSize: 'cover',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '400px',
          height: '50%',
          backgroundImage: 'linear-gradient(to bottom right, #cf8aa9, #fdefca)',
        }}
      >
        <AuthComponent mode={'login'} />
      </Paper>
    </Box>
  );
};

export default Login;
