import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import { User } from '@prisma/client';
import prisma from '../../lib/prisma';
import { Avatar, Box, Grid, Paper, Typography } from '@mui/material';

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
          <Grid container item xs={5}>
            <Grid
              container
              item
              xs={4}
              sx={{ backgroundColor: 'teal' }}
              alignItems="center"
              justifyContent="center"
            >
              <Avatar sx={{ width: 270, height: 270 }}>R</Avatar>
            </Grid>
            {/* TODO: style + put icons for email and phone number */}
            <Grid container item xs={8} direction="column">
              <Grid container item xs={6}>
                <Grid container item xs={6} direction="column">
                  <Grid
                    container
                    item
                    xs={6}
                    alignContent="center"
                    justifyContent="center"
                  >
                    <Typography variant="h5">
                      First name: {user.firstName}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={6}
                    alignContent="center"
                    justifyContent="center"
                  >
                    <Typography variant="h5">Email: {user.email}</Typography>
                  </Grid>
                </Grid>
                <Grid container item xs={6} direction="column">
                  <Grid
                    container
                    item
                    xs={6}
                    alignContent="center"
                    justifyContent="center"
                  >
                    <Typography variant="h5">
                      Last name: {user.lastName}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={6}
                    alignContent="center"
                    justifyContent="center"
                  >
                    <Typography variant="h5">
                      Phone number: 0742547186
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item xs={6}>
                <Typography>
                  Description: We all know photos and videos are important for
                  winning over potential clients, but don’t forget about another
                  essential piece of the puzzle: your profile description. Your
                  profile description tells potential clients what you do, who
                  you are, and what makes you special! Keep the 6 tips below in
                  mind as you're writing it.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={7} sx={{ backgroundColor: 'red' }}>
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
