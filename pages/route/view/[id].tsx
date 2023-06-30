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
  closeRoute,
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
import { mToKm } from '../../../utils/mToKm';
import { mToRestM } from '../../../utils/mToRestM';
import { mToH } from '../../../utils/mToH';
import { CommentsWithRelation, RouteWithRelation } from '../../../lib/types';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

//TODO: SWR ONLY FOR COMMENTS, REST COME FROM SERVER
const ViewRoute = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { data: route, mutate } = useSWR<RouteWithRelation>(`/route/get/${id}`);
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

  const endTour = async () =>
    await closeRoute({ routeId: route.id })
      .then(() =>
        enqueueSnackbar('Closed successfully', {
          variant: 'success',
        }),
      )
      .catch((e) =>
        enqueueSnackbar(e, {
          variant: 'error',
        }),
      );

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

    if (!route) {
      return null;
    }

    return (
      <Grid container>
        <Grid container item xs={5}>
          <Stack sx={{ width: '100%' }} spacing={1}>
            <Box display="flex">
              <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                {t('startDate')}:
              </Typography>
              <Typography>{route.startDate}</Typography>
            </Box>
            <Box display="flex">
              <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                {t('endDate')}:
              </Typography>
              <Typography>{route.endDate}</Typography>
            </Box>
            <Box display="flex">
              <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                {t('meetingTime')}:
              </Typography>
              <Typography>{route.meetingTime}</Typography>
            </Box>
            <Box sx={{ width: '100%', height: '200px' }}>
              <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                {t('meetingLocation')}
              </Typography>
              <MapMarker
                height={'170px'}
                edit={false}
                showMarker={[route.meetingLocationX, route.meetingLocationY]}
              />
            </Box>
            <Box>
              <Box display="flex">
                <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                  {t('partUserNum')}:
                </Typography>
                <Typography>
                  {route.ParticipantUsers.length}
                  {route.maxParticipants !== -1
                    ? `/${route.maxParticipants}`
                    : ''}
                </Typography>
              </Box>
              {!route.price || route.price === '0' ? (
                route.ParticipantUsers.find(
                  (pu) => pu.userId === session.user.id,
                ) ? (
                  <Button>{t('leave')}</Button>
                ) : (
                  <Button onClick={joinTour}>{t('join')}</Button>
                )
              ) : route.ParticipantUsers.find(
                  (pu) => pu.userId === session.user.id,
                ) ? (
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('thxForJoining')}
                </Typography>
              ) : (
                <Box marginTop="2%" display="flex" alignItems="center">
                  <Typography sx={{ fontWeight: 'bold', marginRight: '2%' }}>
                    {t('tourPrice')}:
                  </Typography>
                  <Typography
                    sx={{ marginRight: '2%' }}
                  >{`${route.price}RON`}</Typography>
                  <Button
                    onClick={onPayment}
                    variant="contained"
                    startIcon={<MdCreditCard />}
                  >
                    {t('payNow')}
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
                    mutate();
                  }
                }}
              >
                Comment
              </Button>
            </Box>
            <Stack spacing={2}>
              {(route.Comments as CommentsWithRelation[])
                .slice(0)
                .reverse()
                .map((comment, index) => (
                  <Paper
                    key={index}
                    elevation={2}
                    sx={{ minHeight: '80px', padding: '2%' }}
                  >
                    <Grid container sx={{ width: '100%', height: '100%' }}>
                      <Grid item xs={1}>
                        <Avatar>
                          <Image
                            src={`/profilePictures/${comment.user.profilePicture}`}
                            alt="profile"
                            layout="fill"
                          />
                        </Avatar>
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
              {route.groupTour && (
                <Box>
                  <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                  >
                    <Tab label={t('routeDetails')} {...a11yProps(0)} />
                    <Tab label={t('tourInformations')} {...a11yProps(1)} />
                  </Tabs>
                </Box>
              )}

              <TabPanel value={activeTab} index={0}>
                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" spacing={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {t('diff')}
                        </Typography>
                        <DifficultyIcon />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {t('distance')}
                        </Typography>
                        <Typography>
                          {mToKm(route.distance).toFixed(1)}km
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {t('duration')}
                        </Typography>
                        <Typography>
                          {`${mToH(route.length)}:${mToRestM(route.length)} - ${
                            mToH(route.length) + 1
                          }:${mToRestM(route.length)} h`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {t('type')}
                        </Typography>
                        <TypeIcon />
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {t('routeDescription')}
                    </Typography>
                    <Box>{parse(route.description)}</Box>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {t('galery')}
                    </Typography>
                    <Image
                      width="900"
                      height="400"
                      alt={route.name}
                      src={`/coverPhotos/${route.coverPhoto}`}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {route.groupTour ? t('organizer') : t('creator')}
                      </Typography>
                      <Stack direction="row" spacing={3}>
                        <Link href={`/profile/${route.CreatorUser.id}`}>
                          <Avatar
                            src={`/profilePictures/${route.CreatorUser.profilePicture}`}
                          />
                        </Link>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography>
                            {t('name')}: {route.CreatorUser.lastName}{' '}
                            {route.CreatorUser.firstName}
                          </Typography>
                          <Typography>
                            {t('email')}: {route.CreatorUser.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {session &&
                        session.user.id === route.CreatorUser.id &&
                        route.groupTour &&
                        moment(route.endDate).isAfter() && (
                          <Button onClick={endTour} sx={{ fontWeight: 'bold' }}>
                            {t('closeTour')}
                          </Button>
                        )}
                    </Box>
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
