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
import { grey } from '@mui/material/colors';
import { Badge, Fade, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  MdNotifications,
  MdOutlineTimer,
  MdMail,
  MdAdminPanelSettings,
  MdAddCircle,
  MdOutlinePersonOutline,
  MdSettings,
} from 'react-icons/md';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { readNotification } from '../../../lib/mutations';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { UserWithRelation } from '../../../lib/types';

//TODO: SWR ONLY FOR NOTI, REST COME FROM SERVER
export const Layout = ({ children }) => {
  const { data: session } = useSession();
  const { data: user } = useSWR<UserWithRelation>(
    session ? `/user/get/${session.user.id}` : null,
  );
  const { pathname, asPath, query, push, locale } = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const read = async (notificationId?: number) =>
    notificationId
      ? await readNotification(notificationId)
      : await readNotification('all', { userId: session.user.id });

  return (
    <Box width="100vw" height="100vh" sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'fixed',
          zIndex: '-10',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <Image
          alt="background"
          src="/tripBG.jpg"
          quality={100}
          objectFit="cover"
          layout="fill"
          sizes="100vw"
        />
      </Box>
      <Box height="60px" position="absolute" top="0">
        <AppBar sx={{ height: '60px', background: '#434870' }}>
          <Toolbar disableGutters>
            <Grid container sx={{ width: '100%' }}>
              <Grid item xs={2} sx={{ pl: '2%' }}>
                <Box
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: 'black 1px solid',
                    borderRadius: '5px',
                    transition: 'all .2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => push('/')}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '26px',
                      fontFamily: 'Monaco',
                      lineHeight: 1,
                      color: '#d28cab',
                    }}
                  >
                    Collaboration
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '24px',
                      fontFamily: 'Monaco',
                      lineHeight: 1,
                      color: '#fdecc9',
                    }}
                  >
                    Tour
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={10} container>
                <Box
                  sx={{
                    flexGrow: 0,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'flex-end',
                    mr: '3%',
                  }}
                >
                  {session ? (
                    <>
                      <Tooltip
                        placement="bottom"
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
                              width: '200px',
                              pt: '2%',
                              pb: '2%',
                              backgroundColor: '#FCF0CA',
                              border: '1px solid black',
                            }}
                          >
                            <Stack
                              spacing={1}
                              sx={{
                                width: '100%',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '8px',
                                  cursor: 'pointer',
                                  width: '100%',
                                  transition: 'all .2s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.3)',
                                  },
                                }}
                              >
                                <FaUserCircle size="20" />
                                <Typography
                                  sx={{ ml: '10px', fontWeight: 'bold' }}
                                  onClick={() =>
                                    push(`/profile/${session.user.id}`)
                                  }
                                >
                                  Profile
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '8px',
                                  cursor: 'pointer',
                                  width: '100%',
                                  transition: 'all .2s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.3)',
                                  },
                                }}
                              >
                                <MdSettings size="20" />
                                <Typography
                                  sx={{ ml: '10px', fontWeight: 'bold' }}
                                  onClick={() => push('/settings')}
                                >
                                  Settings
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  width: '100%',
                                  transition: 'all .2s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.3)',
                                  },
                                }}
                              >
                                <MdAddCircle size="20" />
                                <Typography
                                  sx={{ ml: '10px', fontWeight: 'bold' }}
                                  onClick={() => push('route/create')}
                                >
                                  Create tour
                                </Typography>
                              </Box>
                              {user && user.role === 'admin' && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'all .2s ease-in-out',
                                    '&:hover': {
                                      transform: 'scale(1.3)',
                                    },
                                  }}
                                >
                                  <MdAdminPanelSettings size="20" />
                                  <Typography
                                    sx={{ ml: '10px', fontWeight: 'bold' }}
                                    onClick={() => push('/admin')}
                                  >
                                    Admin panel
                                  </Typography>
                                </Box>
                              )}

                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  width: '100%',
                                  transition: 'all .2s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.3)',
                                  },
                                }}
                              >
                                <FaSignOutAlt size="20" />
                                <Typography
                                  sx={{ ml: '10px', fontWeight: 'bold' }}
                                  onClick={() => signOut()}
                                >
                                  Sign out
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        }
                      >
                        <IconButton sx={{ p: 0, mr: '1%' }}>
                          <Avatar>
                            {user && user.profilePicture ? (
                              <Image
                                src={`/profilePictures/${user.profilePicture}`}
                                alt="profile"
                                layout="fill"
                              />
                            ) : (
                              <MdOutlinePersonOutline fontSize="25px" />
                            )}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        open={open}
                        placement="bottom-start"
                        TransitionComponent={Fade}
                        componentsProps={{
                          tooltip: {
                            style: {
                              backgroundColor: 'inherit',
                              marginRight: '165px',
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
                              {user && user.Notifications.length > 0 && (
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
                              )}
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
                                        push(`${noti.redirectLocation}`);
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
                              {user && user.Notifications.length === 0 && (
                                <Box
                                  sx={{
                                    height: '66px',
                                    backgroundColor: 'white',
                                    p: '1%',
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                      No notifications yet!
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
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
                  <Box
                    onClick={() =>
                      push({ pathname, query }, asPath, {
                        locale: locale === 'hu' ? 'en' : 'hu',
                      })
                    }
                    sx={{ height: '25px', ml: '1%', cursor: 'pointer' }}
                  >
                    <Image
                      src={`https://flagcdn.com/w40/${
                        locale === 'hu' ? 'gb' : 'hu'
                      }.png`}
                      alt={locale === 'hu' ? 'en' : 'hu'}
                      width="35px"
                      height="25px"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        height="calc(100vh - 64px)"
        marginTop="64px"
        sx={{ overflow: 'auto' }}
      >
        <Box height="calc(100vh - 64px)">{children}</Box>
      </Box>
    </Box>
  );
};
