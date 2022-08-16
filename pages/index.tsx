import {
  Grid,
  Box,
  InputAdornment,
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  MenuItem,
  Slider,
} from '@mui/material';
import type { NextPage } from 'next';
import { TripCard } from '../src/components/TripCard';
import prisma from '../lib/prisma';
import { Route } from '@prisma/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MdSearch, MdFilterList } from 'react-icons/md';
import { useState } from 'react';

const Home: NextPage = ({ routes }: { routes: Route[] }) => {
  const [filterExpanded, setFilterExpanded] = useState<boolean>(false);
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Accordion
        sx={{ width: '50%', ml: '4%' }}
        expanded={filterExpanded}
        disableGutters
      >
        <AccordionSummary
          expandIcon={
            <MdFilterList
              size={30}
              onClick={() => setFilterExpanded(!filterExpanded)}
            />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <TextField
            sx={{ mr: '2%' }}
            size="small"
            fullWidth
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch />
                </InputAdornment>
              ),
            }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            container
            direction="column"
            sx={{ width: '100%', height: '100%' }}
            spacing={5}
          >
            <Grid item container xs={4} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  select
                  label="Difficulty"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  select
                  label="Route type"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="hiking">Hiking</MenuItem>
                  <MenuItem value="kayaking">Kayaking</MenuItem>
                  <MenuItem value="cycling">Cycling</MenuItem>
                  <MenuItem value="running">Running</MenuItem>
                  <MenuItem value="viaferrata">Via Ferrata</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Grid item container xs={4}>
              <Typography sx={{ fontWeight: 'bold' }}>Distance</Typography>
              <Slider
                defaultValue={0}
                valueLabelDisplay="auto"
                step={1}
                max={100}
              />
            </Grid>
            <Grid item container xs={4}>
              <Typography sx={{ fontWeight: 'bold' }}>Duration</Typography>
              <Slider
                defaultValue={0}
                valueLabelDisplay="auto"
                step={0.5}
                max={12}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Grid container sx={{ width: '92%', mx: '4%', mt: '2%' }}>
        {routes.map((route) => (
          <Grid key={route.id} item xs={7} lg={5} xl={3} sx={{ mb: '2%' }}>
            <TripCard route={route} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export async function getServerSideProps(context) {
  try {
    const routes = await prisma.route.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        difficulty: true,
        type: true,
        groupTour: true,
        maxParticipants: true,
        coverPhoto: true,
        distance: true,
        length: true,
        CreatorUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        ParticipantUsers: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      props: {
        routes,
        ...(await serverSideTranslations(context.locale, ['common'])),
      },
    };
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }
}

export default Home;
