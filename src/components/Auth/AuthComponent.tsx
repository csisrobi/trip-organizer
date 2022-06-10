import { Stack, Typography } from '@mui/material';
import React, { FC } from 'react';
import { LoginComponent } from './LoginComponent';
import { RegisterComponent } from './RegisterComponent';

export const AuthComponent: FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  return (
    <Stack
      spacing={3}
      direction="column"
      alignItems="center"
      sx={{ marginTop: '5vh' }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {mode === 'login' ? 'Login' : 'Register'}
      </Typography>
      {mode === 'login' ? <LoginComponent /> : <RegisterComponent />}
    </Stack>
  );
};
