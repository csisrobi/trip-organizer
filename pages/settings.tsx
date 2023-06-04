import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Box,
  Button,
  Grid,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { User } from '@prisma/client';
import { Editor } from '@tinymce/tinymce-react';
import { getSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { MdDelete, MdUpload } from 'react-icons/md';
import * as yup from 'yup';
import { authLogin, changeSettings } from '../lib/mutations';
import prisma from '../lib/prisma';

type Props = {
  user: User;
};

const Settings = ({ user }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const validationSchema = yup.object({
    newPass: yup.string(),
    oldPass: yup.string().when('newPass', {
      is: (value) => value !== '',
      then: yup
        .string()
        .required('Old password is required')
        .test(
          'checkOldPasswordMatch',
          'The password is not correct',
          async function (value) {
            return await authLogin({
              password: value,
              email: user.email,
            }).then(async (res) => !!res.error === false);
          },
        ),
    }),
    repeatNewPass: yup
      .string()
      .oneOf([yup.ref('newPass'), null], 'Passwords must match'),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = useMemo(() => {
    return handleSubmit((data) => {
      const formData = new FormData();
      formData.append('id', user.id.toString());
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('description', data.description);
      if (data.newPassword) {
        formData.append('newPassword', data.newPassword);
      }
      formData.append('file', data.profilePicture[0]);
      (async () => {
        const settings = await changeSettings(formData);
        if (!settings.error) {
          enqueueSnackbar('Settings changed successfully', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar(settings.error, {
            variant: 'error',
          });
        }
      })();
    });
  }, [enqueueSnackbar, handleSubmit, user.id]);

  const UploadAvatar = () => {
    const profilePicture = useWatch({
      control,
      name: 'profilePicture',
    });

    return (
      <>
        <Avatar
          alt="Avatar"
          src={
            profilePicture && profilePicture[0]
              ? URL.createObjectURL(profilePicture[0])
              : user.profilePicture
              ? `./profilePictures/${user.profilePicture}`
              : ''
          }
          imgProps={{
            style: {
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'cover',
            },
          }}
        />

        <label htmlFor="contained-button-file">
          <input
            {...register('profilePicture')}
            hidden
            accept="image/*"
            id="contained-button-file"
            type="file"
          />
          <Button variant="contained" component="span">
            {profilePicture && profilePicture[0] ? <MdDelete /> : <MdUpload />}
          </Button>
        </label>
      </>
    );
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
        }}
      >
        <Grid
          container
          direction="column"
          sx={{ height: '100%', width: '100%' }}
        >
          <Grid item container xs={6}>
            <Grid
              item
              container
              xs={6}
              alignContent="center"
              alignItems="center"
              direction="column"
            >
              <Typography variant="h4" sx={{ margin: '15px' }}>
                Basic info
              </Typography>
              <Stack spacing={4} sx={{ width: '70%' }}>
                <OutlinedInput
                  id="firstname"
                  size="small"
                  sx={{ backgroundColor: 'white' }}
                  defaultValue={user.firstName}
                  disabled
                />
                <OutlinedInput
                  placeholder="Last name"
                  size="small"
                  sx={{ backgroundColor: 'white' }}
                  defaultValue={user.lastName}
                  disabled
                />
                <OutlinedInput
                  placeholder="Email"
                  size="small"
                  sx={{ backgroundColor: 'white' }}
                  defaultValue={user.email}
                  disabled
                />
                <OutlinedInput
                  {...register('phoneNumber')}
                  placeholder="Phone number"
                  size="small"
                  sx={{ backgroundColor: 'white' }}
                  defaultValue={user.phoneNumber}
                />
                <Grid item container alignItems="center">
                  <Typography sx={{ marginRight: '10px' }}>
                    Profile picture:
                  </Typography>
                  <UploadAvatar />
                </Grid>
              </Stack>
            </Grid>
            <Grid item container xs={6}>
              <Grid
                item
                container
                direction="column"
                alignContent="center"
                alignItems="center"
              >
                <Typography variant="h4" sx={{ margin: '15px' }}>
                  Change password
                </Typography>
                <Stack spacing={4} sx={{ width: '70%' }}>
                  <Stack>
                    {/* TODO: THINK ABOUT LABELS */}
                    <OutlinedInput
                      {...register('oldPass')}
                      placeholder="Old password"
                      type="password"
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                      error={!!errors['oldPass']}
                    />
                    {errors['oldPass'] && (
                      <Typography fontSize="12px" sx={{ color: 'red' }}>
                        {errors['oldPass'].message}
                      </Typography>
                    )}
                  </Stack>
                  <Stack>
                    <OutlinedInput
                      {...register('newPass')}
                      placeholder="New password"
                      type="password"
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                      error={!!errors['newPass']}
                    />
                    {errors['newPass'] && (
                      <Typography fontSize="12px" sx={{ color: 'red' }}>
                        {errors['newPass'].message}
                      </Typography>
                    )}
                  </Stack>
                  <Stack>
                    <OutlinedInput
                      {...register('repeatNewPass')}
                      placeholder="Repeat new password"
                      type="password"
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                      error={!!errors['repeatNewPass']}
                    />
                    {errors['repeatNewPass'] && (
                      <Typography fontSize="12px" sx={{ color: 'red' }}>
                        {errors['repeatNewPass'].message}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
              <Grid
                item
                container
                alignContent="center"
                justifyContent="center"
              >
                <Button variant="contained" onClick={handleFormSubmit}>
                  SAVE CHANGES
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* TODO: LOCAL SERVER TINY MCE */}
          <Grid item container xs={6} sx={{ width: '100%' }}>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, ...field } }) => (
                <Editor
                  {...field}
                  onEditorChange={onChange}
                  apiKey="ddx2tyrwzirbdmwssqvuisccxytuf76t0z5kawg9eds75t8j"
                  initialValue={user.description || ' '}
                  init={{
                    height: '100%',
                    width: '100%',
                    menubar: false,
                    resize: false,
                    toolbar:
                      'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
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
  } catch (e) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }
}

export default Settings;
