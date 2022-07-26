import {
  Box,
  Stack,
  Typography,
  Grid,
  Avatar,
  Button,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import { Route } from '@prisma/client';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import {
  getFile,
  joinRoute,
  payRoute,
  createComment,
} from '../../../lib/mutations';
import { GiHiking, GiMountainClimbing, GiCycling } from 'react-icons/gi';
import {
  MdKayaking,
  MdDirectionsRun,
  MdStarRate,
  MdCreditCard,
  MdCircle,
} from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const ViewRoute = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { data: route } = useSWR<Route>(`/route/get/${id}`, fetcher);
  const { enqueueSnackbar } = useSnackbar();
  const [coordinates, setCoordinates] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const Map = dynamic(() => import('../../../src/components/MapDisplay'), {
    loading: () => <CircularProgress />,
    ssr: false,
  });

  const MapMarker = dynamic(() => import('../../../src/components/MapMarker'), {
    loading: () => <CircularProgress />,
    ssr: false,
  });
  const TypeIcon = () => {
    switch (route.type) {
      case 'hiking':
        return <GiHiking />;
      case 'kayaking':
        return <MdKayaking />;
      case 'cycling':
        return <GiCycling />;
      case 'running':
        return <MdDirectionsRun />;
      case 'viaferrata':
        return <GiMountainClimbing />;
      default:
        return <></>;
    }
  };

  const DifficultyIcon = () => {
    switch (route.difficulty) {
      case 'easy':
        return <MdStarRate />;
      case 'medium':
        return (
          <Box>
            <MdStarRate />
            <MdStarRate />
          </Box>
        );
      case 'hard':
        return (
          <Box>
            <MdStarRate />
            <MdStarRate />
            <MdStarRate />
          </Box>
        );
      default:
        return <></>;
    }
  };

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  const joinTour = async () =>
    await joinRoute({ userId: session.user.id, routeId: route.id })
      .then(() =>
        enqueueSnackbar('Joined successfully', {
          variant: 'success',
        }),
      )
      .catch((e) =>
        enqueueSnackbar(e, {
          variant: 'error',
        }),
      );

  const onPayment = async () =>
    await payRoute({ stripePrice: route.stripePrice, routeId: route.id }).then(
      (data) => (window.location.href = data.url),
    );

  useEffect(() => {
    (async () => {
      if (route && route.track) {
        setCoordinates(await getFile(route.track));
      }
    })();
  }, [route]);

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  const TourInformation = () => {
    const [activeComment, setActiveComment] = useState('');

    const onComment = async () =>
      await createComment({
        routeId: route.id,
        userId: session.user.id,
        content: activeComment,
      });

    return (
      <Grid container>
        <Grid container item xs={5}>
          <Stack sx={{ width: '100%' }} spacing={1}>
            <Box display="flex">
              <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                Start date:
              </Typography>
              <Typography>{route.startDate}</Typography>
            </Box>
            <Box display="flex">
              <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                End date:
              </Typography>
              <Typography>{route.endDate}</Typography>
            </Box>
            <Box display="flex">
              <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                Meeting time:
              </Typography>
              <Typography>{route.meetingTime}</Typography>
            </Box>
            <Box sx={{ width: '100%', height: '200px' }}>
              <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                Meeting location
              </Typography>
              <MapMarker
                height={'170px'}
                edit={false}
                showMarker={route.meetingLocation}
              />
            </Box>
            <Box>
              <Box display="flex">
                <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                  Participating user numbers:
                </Typography>
                <Typography>
                  {route.ParticipantUsers.length}
                  {route.maxParticipants !== -1
                    ? `/${route.maxParticipants}`
                    : ''}
                </Typography>
              </Box>
              {!route.price ? (
                route.ParticipantUsers.find(
                  (pu) => pu.id === session.user.id,
                ) ? (
                  <Button>LEAVE</Button>
                ) : (
                  <Button onClick={joinTour}>JOIN</Button>
                )
              ) : route.ParticipantUsers.find(
                  (pu) => pu.id === session.user.id,
                ) ? (
                <Typography sx={{ fontWeight: 'bold' }}>
                  Thank you for joining us!
                </Typography>
              ) : (
                <Box marginTop="2%" display="flex" alignItems="center">
                  <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                    Tour price:
                  </Typography>
                  <Typography
                    sx={{ marginRight: '2%' }}
                  >{`${route.price}RON`}</Typography>
                  <Button
                    onClick={onPayment}
                    variant="outlined"
                    startIcon={<MdCreditCard />}
                  >
                    Pay now
                  </Button>
                </Box>
              )}
            </Box>
          </Stack>
        </Grid>
        <Grid
          container
          item
          xs={7}
          sx={{ p: '2%', maxHeight: '55vh', overflow: 'scroll' }}
        >
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Box sx={{ width: '100%' }}>
              <TextField
                sx={{ width: '100%' }}
                multiline
                rows={3}
                placeholder="Leave your comment"
                value={activeComment}
                onChange={(e) => setActiveComment(e.target.value)}
              />
              <Button
                sx={{ mt: '1%', float: 'right' }}
                variant="contained"
                size="small"
                onClick={() => {
                  if (activeComment !== '') {
                    onComment();
                    setActiveComment('');
                  }
                }}
              >
                Comment
              </Button>
            </Box>
            <Stack spacing={2}>
              {route.Comments.slice(0)
                .reverse()
                .map((comment, index) => (
                  <Paper
                    key={index}
                    elevation={2}
                    sx={{ minHeight: '80px', padding: '2%' }}
                  >
                    <Grid container sx={{ width: '100%', height: '100%' }}>
                      <Grid item xs={1}>
                        <Avatar
                          src={`/profilePictures/${comment.user.profilePicture}`}
                        />
                      </Grid>
                      <Grid
                        container
                        item
                        xs={11}
                        direction="column"
                        sx={{ pl: '1%', flexWrap: 'nowrap' }}
                      >
                        <Grid item container xs={1} alignItems="center">
                          <Typography
                            sx={{
                              mr: '2%',
                              fontWeight: 'bold',
                              fontSize: '120%',
                            }}
                          >{`${comment.user.firstName} ${comment.user.lastName}`}</Typography>
                          <MdCircle
                            style={{
                              fontSize: '50%',
                              opacity: '0.5',
                              color: 'grey',
                            }}
                          />
                          <Typography
                            sx={{
                              ml: '2%',
                            }}
                          >
                            {moment(comment.createdAt).fromNow()}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={11}
                          sx={{ wordBreak: 'break-all' }}
                        >
                          <Typography>{comment.content}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        pb: '2%',
      }}
    >
      {!route ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ width: '100%' }}>
            {coordinates.length > 0 && (
              <Map
                coordinates={coordinates as unknown as LatLngExpression[][]}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '2%' }}>
            <Paper sx={{ p: '2%', width: '60%' }} elevation={15}>
              <Typography variant="h2">{route.name}</Typography>
              <Box>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                >
                  <Tab label={t('routeDetails')} {...a11yProps(0)} />
                  <Tab label="Tour informations" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={activeTab} index={0}>
                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" spacing={4}>
                      <Box>
                        <Typography>Difficulty</Typography>
                        <DifficultyIcon />
                      </Box>
                      <Box>
                        <Typography>Distance</Typography>
                        <Typography>
                          {(parseInt(route.distance) / 1000).toFixed(1)}km
                        </Typography>
                      </Box>
                      <Box>
                        <Typography>Duration</Typography>
                        <Typography>
                          {`${Math.floor(parseInt(route.length) / 60)}:${
                            parseInt(route.length) % 60
                          } - ${Math.floor(parseInt(route.length) / 60) + 1}:${
                            parseInt(route.length) % 60
                          } h`}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography>Type</Typography>
                        <TypeIcon />
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Route description
                    </Typography>
                    <Box>{parse(route.description)}</Box>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }}>Galery</Typography>
                    <Image
                      width="900"
                      height="400"
                      alt={route.name}
                      src={`/coverPhotos/${route.coverPhoto}`}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {route.groupTour ? 'Organizer' : 'Creator'}
                    </Typography>
                    <Stack direction="row" spacing={3}>
                      <Link href={`/profile/${route.CreatorUser.id}`}>
                        <Avatar
                          src={`/profilePictures/${route.CreatorUser.profilePicture}`}
                        />
                      </Link>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography>
                          Name: {route.CreatorUser.lastName}{' '}
                          {route.CreatorUser.firstName}
                        </Typography>
                        <Typography>
                          Email: {route.CreatorUser.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                {route.groupTour && <TourInformation />}
              </TabPanel>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const session = await getSession(context);
  try {
    const user = await prisma.route.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        groupTour: true,
      },
    });

    if (user.groupTour === true && !session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        id,
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

export default ViewRoute;
