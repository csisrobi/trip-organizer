import { Avatar, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { MdEmail, MdPerson, MdPhone } from 'react-icons/md';
import prisma from '../../lib/prisma';
import { UserWithRelation } from '../../lib/types';
import { mToKm } from '../../utils/mToKm';
ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  user: UserWithRelation;
};
//TODO: RESTYLE/ 1 CARD WITH AVATAR AND INFORMATION, UNDER IT DESCRIPTION, UNDER IT STAT
const Profile = ({ user }: Props) => {
  const countTypeFromData = (type: string, value: string) =>
    user.FinishedRoutes?.filter((fr) => fr.route[type] === value).length || 0;

  const data1 = {
    labels: ['Hiking', 'Cycling', 'Via Ferrata', 'Running', 'Kayaking'],
    datasets: [
      {
        data: [
          countTypeFromData('type', 'hiking') + 12,
          countTypeFromData('type', 'cycling') + 8,
          countTypeFromData('type', 'viaferrata') + 3,
          countTypeFromData('type', 'running') + 1,
          countTypeFromData('type', 'kayaking') + 5,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const data2 = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [
          countTypeFromData('difficulty', 'easy') + 12,
          countTypeFromData('difficulty', 'medium') + 9,
          countTypeFromData('difficulty', 'hard') + 8,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

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
          padding: 2,
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
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Description
                  </Typography>
                  <span
                    dangerouslySetInnerHTML={{ __html: user.description }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={8} direction="column" sx={{ pl: '5%' }}>
            <Grid container item xs={2}>
              <Typography sx={{ fontWeight: 'bold' }}>
                Completed km:{' '}
                {user.FinishedRoutes &&
                  mToKm(
                    user.FinishedRoutes.map((fr) => parseInt(fr.route.distance))
                      .reduce((a, b) => a + b, 0)
                      .toString(),
                  ) + 30}
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={10}
              alignContent="center"
              justifyContent="center"
            >
              <Grid container item xs={5}>
                <Pie data={data1} />
              </Grid>
              <Grid container item xs={5}>
                <Pie data={data2} />
              </Grid>
            </Grid>
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
        FinishedRoutes: {
          select: {
            route: {
              select: {
                difficulty: true,
                type: true,
                distance: true,
              },
            },
          },
        },
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
