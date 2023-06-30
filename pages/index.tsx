import {
  Grid,
  Box,
  InputAdornment,
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Slider,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import type { NextPage } from 'next';
import { TripCard } from '../src/components/TripCard';
import prisma from '../lib/prisma';
import { Route } from '@prisma/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MdSearch, MdFilterList } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { mToKm } from '../utils/mToKm';
import { mToH } from '../utils/mToH';
import { getSession, useSession } from 'next-auth/react';
import useSWR from 'swr';

type Filter = {
  search: string;
  diff: string;
  type: string;
  distance: number[];
  duration: number[];
};

const routeType = [
  { label: 'Hiking', value: 'hiking' },
  { label: 'Kayaking', value: 'kayaking' },
  { label: 'Cycling', value: 'cycling' },
  { label: 'Running', value: 'running' },
  { label: 'Via Ferrata', value: 'viaferrata' },
];

const routeDiff = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

const Home: NextPage = ({ routes }: { routes: Route[] }) => {
  const { data: session } = useSession();
  const [showEveryTour, setShowEveryTour] = useState<boolean>(false);
  const [routesData, setRoutesData] = useState<Route[]>([]);
  const [pagination, setPagination] = useState(1);
  const { data: upToDateRoutes } = useSWR<Route[]>(
    `/route/get/${session ? 'all' : 'tours'}`,
  );
  useEffect(() => {
    if (upToDateRoutes) {
      setRoutesData(upToDateRoutes);
    }
  }, [routesData, upToDateRoutes]);

  const [filterExpanded, setFilterExpanded] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>({
    search: '',
    diff: null,
    type: null,
    distance: [0, 100],
    duration: [0, 12],
  });

  const filterRoute = (value: Route) =>
    (filter.search === '' ||
      value.name.toLowerCase().includes(filter.search.toLowerCase())) &&
    (filter.diff === null || value.difficulty === filter.diff) &&
    (filter.type === null || value.type === filter.type) &&
    (!session || showEveryTour || value.groupTour) &&
    mToKm(value.distance) <= filter.distance[1] &&
    mToKm(value.distance) >= filter.distance[0] &&
    mToH(value.length) <= filter.duration[1] &&
    mToH(value.length) >= filter.duration[0];

  const handleChangeSlider = (
    newValue: number | number[],
    activeThumb: number,
    name: string,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (name === 'distance') {
      if (activeThumb === 0) {
        setFilter({
          ...filter,
          distance: [
            Math.min(newValue[0], filter.distance[1] - 1),
            filter.distance[1],
          ],
        });
      } else {
        setFilter({
          ...filter,
          distance: [
            filter.distance[0],
            Math.max(newValue[1], filter.distance[0] + 1),
          ],
        });
      }
    } else {
      if (activeThumb === 0) {
        setFilter({
          ...filter,
          duration: [
            Math.min(newValue[0], filter.duration[1] - 1),
            filter.duration[1],
          ],
        });
      } else {
        setFilter({
          ...filter,
          duration: [
            filter.duration[0],
            Math.max(newValue[1], filter.duration[0] + 1),
          ],
        });
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        mt: '2%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
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
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
              value={filter.search}
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
                  <Autocomplete
                    size="small"
                    fullWidth
                    value={routeType.find((type) => type.value === filter.diff)}
                    options={routeDiff}
                    onChange={(e, value: { label: string; value: string }) =>
                      setFilter({ ...filter, diff: value ? value.value : null })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Difficulty"
                        InputLabelProps={{
                          sx: {
                            '&.Mui-focused': {
                              color: 'black',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    value={routeType.find((type) => type.value === filter.type)}
                    options={routeType}
                    onChange={(e, value: { label: string; value: string }) =>
                      setFilter({ ...filter, type: value ? value.value : null })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Route type"
                        InputLabelProps={{
                          sx: {
                            '&.Mui-focused': {
                              color: 'black',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={4}>
                <Typography sx={{ fontWeight: 'bold' }}>Distance</Typography>
                <Slider
                  valueLabelDisplay="auto"
                  step={1}
                  max={100}
                  value={filter.distance}
                  onChange={(
                    _event: Event,
                    newValue: number | number[],
                    activeThumb: number,
                  ) => handleChangeSlider(newValue, activeThumb, 'distance')}
                />
              </Grid>
              <Grid item container xs={4}>
                <Typography sx={{ fontWeight: 'bold' }}>Duration</Typography>
                <Slider
                  valueLabelDisplay="auto"
                  step={0.5}
                  max={12}
                  value={filter.duration}
                  onChange={(
                    event: Event,
                    newValue: number | number[],
                    activeThumb: number,
                  ) => handleChangeSlider(newValue, activeThumb, 'duration')}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        {session && (
          <Box sx={{ flexGrow: 1, mt: '10px' }}>
            <FormControlLabel
              sx={{ ml: '2%', width: '100%' }}
              componentsProps={{
                typography: {
                  sx: { fontWeight: 'bold', transform: 'scale(1.3)', ml: '3%' },
                },
              }}
              label="Show every tour"
              control={
                <Checkbox
                  disableRipple
                  sx={{
                    transform: 'scale(1.3)',
                    color: '#434870',
                    '&.Mui-checked': {
                      color: '#434870',
                    },
                  }}
                  checked={showEveryTour}
                  onChange={() => setShowEveryTour(!showEveryTour)}
                />
              }
            />
          </Box>
        )}
      </Box>

      <Grid container sx={{ width: '92%', mx: '4%', mt: '2%' }}>
        {routesData
          .slice(0, pagination * 6)
          // .filter((route) => filterRoute(route))
          .map((route) => (
            <Grid key={route.id} item xs={7} lg={5} xl={3} sx={{ mb: '2%' }}>
              <TripCard route={route} />
            </Grid>
          ))}
      </Grid>
      <Button onClick={() => setPagination(pagination + 1)}>Paginate</Button>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  try {
    const routes = await prisma.route.findMany({
      where: {
        approval: 'approved',
        ...(!session && { groupTour: false }),
      },
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
            userId: true,
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
