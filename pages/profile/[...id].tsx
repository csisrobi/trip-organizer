import React, { useState } from 'react';
import { User } from '@prisma/client';
import prisma from '../../lib/prisma';
import { Avatar, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { MdEmail, MdPerson, MdPhone } from 'react-icons/md';

type Props = {
  user: User;
};
//TODO: RESTYLE/ 1 CARD WITH AVATAR AND INFORMATION, UNDER IT DESCRIPTION, UNDER IT STAT
const Profile = ({ user }: Props) => {
  return (
    <Box
      width="100%"
      height="100%"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '60%',
          height: '100%',
        }}
      >
        <Grid
          container
          direction="column"
          sx={{ height: '100%', width: '100%' }}
        >
          <Grid
            container
            item
            xs={4}
            sx={{
              pt: '1%',
            }}
          >
            <Grid
              container
              item
              xs={4}
              direction="column"
              alignContent="center"
              justifyContent="flex-start"
            >
              <Stack spacing={2}>
                <Avatar
                  src={`/profilePictures/${user.profilePicture}`}
                  sx={{ width: 150, height: 150 }}
                >
                  R
                </Avatar>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MdPerson />
                  <Typography>
                    : {user.firstName} {user.lastName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MdEmail />
                  <Typography>: {user.email}</Typography>
                </Box>
                {user.phoneNumber && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MdPhone />
                    <Typography>: {user.phoneNumber}</Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
            {/* TODO: style + put icons for email and phone number */}
            <Grid container item xs={8} direction="column">
              <Grid container item>
                <Box>
                  <Typography>Description</Typography>
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: user.description }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={8} sx={{ backgroundColor: 'red' }}>
            STATISZTIKA
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id[0]),
      },
      select: {
        firstName: true,
        lastName: true,
        id: true,
        email: true,
        phoneNumber: true,
        description: true,
        profilePicture: true,
      },
    });
    return {
      props: { user },
    };
  } catch {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }
}

export default Profile;
