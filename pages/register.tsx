import React from 'react';
import { Paper, Box } from '@mui/material';
import { AuthComponent } from '../src/components/Auth';

const Register = () => {
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
          height: '60%',
          backgroundImage: 'linear-gradient(to bottom right, #cf8aa9, #fdefca)',
        }}
      >
        <AuthComponent mode={'register'} />
      </Paper>
    </Box>
  );
};

export default Register;
