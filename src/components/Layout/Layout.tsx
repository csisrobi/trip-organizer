import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import Link from 'next/link';
import { Badge, Fade, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  MdNotifications,
  MdOutlineTimer,
  MdMail,
  MdArrowBackIosNew,
} from 'react-icons/md';
import { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { readNotification } from '../../../lib/mutations';
import Image from 'next/image';

export const Layout = ({ children }) => {
  const { data: session } = useSession();
  const { data: user } = useSWR<User>(
    `/user/get/${session ? session.user.id : undefined}`,
    fetcher,
  );
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const mainPage = router.pathname === '/';
  const read = async (notificationId?: number) =>
    notificationId
      ? await readNotification(notificationId)
      : await readNotification('all', { userId: session.user.id });

  return (
    <Box
      width="100vw"
      height="100vh"
      sx={{ overflow: 'hidden', background: `url(${'./tripBG.jpg'})` }}
    >
      <Box height="80px" position="absolute" top="0">
        <AppBar sx={{ height: '60px', background: '#434870' }}>
          <Toolbar disableGutters>
            <Grid container sx={{ width: '100%' }}>
              {!mainPage && (
                <Grid item xs={1}>
                  <MdArrowBackIosNew
                    style={{ fontSize: '50px', cursor: 'pointer' }}
                    onClick={() => router.push('/')}
                  />
                </Grid>
              )}
              <Grid
                item
                xs={mainPage ? 11 : 10}
                container
                justifyContent="center"
                alignItems="center"
              >
                <Stack direction="row" spacing={30}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Tours
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Organized tours
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={1} container>
                <Box
                  sx={{
                    flexGrow: 0,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    float: 'right',
                  }}
                >
                  {session ? (
                    <>
                      <IconButton sx={{ p: 0, mr: '10%' }}>
                        <Avatar>
                          <Image
                            src={`/profilePictures/${
                              user ? user.profilePicture : ''
                            }`}
                            alt="profile"
                            layout="fill"
                          />
                        </Avatar>
                      </IconButton>
                      <Tooltip
                        open={open}
                        placement="bottom-end"
                        TransitionComponent={Fade}
                        componentsProps={{
                          tooltip: {
                            style: {
                              backgroundColor: 'inherit',
                            },
                          },
                        }}
                        title={
                          <Paper
                            sx={{
                              width: '500px',
                              border: '1px solid black',
                            }}
                          >
                            <Box
                              sx={{
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#434870',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: '18px',
                                  flexGrow: 1,
                                  ml: '4%',
                                }}
                              >
                                Notifications
                              </Typography>
                              <Typography
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: '15px',
                                  mr: '4%',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                                onClick={() => read()}
                              >
                                Read all
                              </Typography>
                            </Box>
                            <Stack
                              sx={{ maxHeight: '200px', overflow: 'scroll' }}
                            >
                              {user &&
                                user.Notifications &&
                                user.Notifications.map((noti, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      cursor: 'pointer',
                                      height: '66px',
                                      backgroundColor: noti.read
                                        ? 'white'
                                        : 'lightblue',
                                      p: '1%',
                                    }}
                                    onClick={() => {
                                      if (!noti.read) {
                                        read(noti.id);
                                      }
                                      if (noti.redirectLocation) {
                                        router.push(`${noti.redirectLocation}`);
                                      }
                                    }}
                                  >
                                    <Box
                                      height="60%"
                                      display="flex"
                                      alignItems="center"
                                    >
                                      <MdMail
                                        style={{
                                          fontSize: '15px',
                                          marginRight: '2%',
                                        }}
                                      />
                                      <Typography sx={{ fontWeight: 'bold' }}>
                                        {noti.content}
                                      </Typography>
                                    </Box>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      height="40%"
                                    >
                                      <MdOutlineTimer
                                        style={{
                                          fontSize: '15px',
                                          marginRight: '2%',
                                        }}
                                      />
                                      <Typography sx={{ fontWeight: 'bold' }}>
                                        {moment(noti.createdAt).format(
                                          'MMMM Do YYYY, h:mm:ss a',
                                        )}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                            </Stack>
                          </Paper>
                        }
                      >
                        <Badge
                          onClick={() => setOpen(!open)}
                          badgeContent={
                            user && user.Notifications
                              ? user.Notifications.filter((noti) => !noti.read)
                                  .length
                              : 0
                          }
                          componentsProps={{
                            badge: {
                              style: {
                                backgroundColor: '#ffecc4',
                                color: 'black',
                              },
                            },
                          }}
                        >
                          <MdNotifications
                            style={{
                              cursor: 'pointer',
                              color: 'white',
                              fontSize: '40px',
                            }}
                          />
                        </Badge>
                      </Tooltip>
                    </>
                  ) : (
                    <Link href={'/login'}>
                      <Button>SIGN IN</Button>
                    </Link>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
      <Box marginTop="80px" sx={{ overflow: 'auto' }}>
        <Box height="calc(100vh - 80px)">{children}</Box>
      </Box>
    </Box>
  );
};
