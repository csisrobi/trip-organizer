import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { User } from '@prisma/client';
import { getSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { createRoute } from '../../lib/mutations';
import { xml2json } from 'xml-js';
import { LatLngExpression } from 'leaflet';
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { DevTool } from '@hookform/devtools';
import { useRouter } from 'next/router';

const CreateRoute = ({ user }: { user: User }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const Map = dynamic(() => import('../../src/components/MapDisplay'), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  });

  const MapLocation = dynamic(() => import('../../src/components/MapMarker'), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  });
  const [coordinates, setCoordinates] = useState<number[][]>([]);

  const showMap = (e) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const result = JSON.parse(
        xml2json(text as string, { compact: true, spaces: 4 }),
      );
      const response =
        result.kml.Document.Placemark.LineString.coordinates._text
          .split(' ')
          .map((data) => data.split(',').map((value) => parseFloat(value)))
          .map((data) => [data[1], data[0], data[2]]);
      setCoordinates(response);
    };
    reader.readAsText(e.target.files[0]);
  };
  const handleFormSubmit = React.useMemo(() => {
    return handleSubmit((data) => {
      console.log(data);
      const formData = new FormData();
      formData.append('userId', user.id.toString());
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('distance', data.distance);
      formData.append('difficulty', data.difficulty);
      formData.append('description', data.description);
      formData.append('length', data.length);
      formData.append('groupTour', data.public);
      formData.append('routeFile', data.routeFile);
      formData.append('coverPhoto', data.coverPhoto);
      if (data.public === true) {
        formData.append('maxParticipants', data.maxNumParticipants);
        formData.append('price', data.price);
        formData.append('meetingLocation[]', data.meetingLocation[0]);
        formData.append('meetingLocation[]', data.meetingLocation[1]);
        formData.append(
          'meetingTime',
          moment(data.meetingTime).format('hh:mm a'),
        );
        formData.append('startDate', data.startDate);
        formData.append('endDate', data.endDate);
      }

      (async () => {
        const settings = await createRoute(formData);
        if (!settings.error) {
          enqueueSnackbar('Route created successfully', {
            variant: 'success',
          });
          router.replace('/');
        } else {
          enqueueSnackbar(settings.error, {
            variant: 'error',
          });
        }
      })();
    });
  }, [enqueueSnackbar, handleSubmit, router, user.id]);

  const UploadKml = () => {
    const routeFile = useWatch({
      control,
      name: 'routeFile',
    });

    return (
      <Box>
        <TextField
          label="Route kml file"
          value={routeFile ? routeFile.name : ''}
          size="small"
          disabled
        />
        <label htmlFor="routefile">
          <Controller
            control={control}
            name="routeFile"
            render={({ field: { onChange } }) => (
              <>
                <input
                  hidden
                  id="routefile"
                  type="file"
                  onChange={(e) => {
                    showMap(e);
                    onChange(e.target.files[0]);
                  }}
                />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </>
            )}
          />
        </label>
      </Box>
    );
  };

  const UploadCoverPhoto = () => {
    const coverPhoto = useWatch({
      control,
      name: 'coverPhoto',
    });

    return (
      <Box>
        <TextField
          label="Cover photo"
          value={coverPhoto ? coverPhoto.name : ''}
          size="small"
          disabled
        />
        <label htmlFor="coverphoto">
          <Controller
            control={control}
            name="coverPhoto"
            render={({ field: { onChange } }) => (
              <>
                <input
                  {...register('coverPhoto')}
                  hidden
                  id="coverphoto"
                  type="file"
                  onChange={(e) => onChange(e.target.files[0])}
                />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </>
            )}
          />
        </label>
      </Box>
    );
  };

  const GroupTour = () => {
    const groupTour = useWatch({
      control,
      name: 'public',
    });
    if (groupTour) {
      return (
        <>
          <Grid container item xs={6}>
            <Stack
              spacing={2}
              direction="column"
              sx={{ width: '100%', height: '100%', mr: '2%' }}
            >
              <TextField
                size="small"
                {...register('maxNumParticipants')}
                type="number"
                label="Max number of participants"
              />
              <TextField
                {...register('price')}
                size="small"
                type="number"
                label="Price"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">RON</InputAdornment>
                  ),
                }}
              />
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      value={value}
                      onChange={(e) => {
                        onChange(moment(e).format('YYYY.MM.DD'));
                      }}
                      mask="____.__.__"
                      inputFormat="YYYY.MM.DD"
                      label="Start date"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      value={value}
                      onChange={(e) => {
                        onChange(moment(e).format('YYYY.MM.DD'));
                      }}
                      mask="____.__.__"
                      inputFormat="YYYY.MM.DD"
                      label="End date"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  control={control}
                  name="meetingTime"
                  render={({ field: { onChange, value } }) => (
                    <TimePicker
                      ampm
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      mask="__:__ _"
                      inputFormat="hh:mm a"
                      label="Meeting time"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid container item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>
              Set the meeting location
            </Typography>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Controller
                control={control}
                name="meetingLocation"
                render={({ field: { onChange, value } }) => (
                  <MapLocation
                    showMarker={value}
                    onChange={onChange}
                    edit={true}
                  />
                )}
              />
            </Box>
          </Grid>
        </>
      );
    }
    return <></>;
  };

  return (
    <Box width="100%" height="100%">
      <Paper
        elevation={5}
        sx={{
          width: '100%',
          height: '100%',
          pl: '2%',
          pb: '2%',
          overflow: 'auto',
        }}
      >
        <Grid container direction="column">
          <Grid xs={6} sx={{ mt: '10px' }} container item>
            <Grid item xs={6}>
              <Stack spacing={3}>
                <Typography variant="h4">Create your route</Typography>
                <TextField
                  {...register('name')}
                  size="small"
                  type="text"
                  label="Name"
                  variant="outlined"
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, ...field } }) => (
                    <Box>
                      <Typography>Description</Typography>
                      <Editor
                        {...field}
                        onEditorChange={onChange}
                        apiKey="ddx2tyrwzirbdmwssqvuisccxytuf76t0z5kawg9eds75t8j"
                        initialValue={' '}
                        init={{
                          height: '280px',
                          width: '100%',
                          label: 'Description',
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
                    </Box>
                  )}
                />
                <UploadCoverPhoto />
                <TextField
                  {...register('difficulty')}
                  size="small"
                  select
                  label="Difficulty"
                  variant="outlined"
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </TextField>
                <TextField
                  {...register('type')}
                  size="small"
                  select
                  label="Route type"
                  variant="outlined"
                >
                  <MenuItem value="hiking">Hiking</MenuItem>
                  <MenuItem value="kayaking">Kayaking</MenuItem>
                  <MenuItem value="cycling">Cycling</MenuItem>
                  <MenuItem value="running">Running</MenuItem>
                  <MenuItem value="viaferrata">Via Ferrata</MenuItem>
                </TextField>
                <UploadKml />
                <TextField
                  {...register('distance')}
                  size="small"
                  type="text"
                  label="Distance"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">m</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  {...register('length')}
                  size="small"
                  type="text"
                  label="Time length"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">minute</InputAdornment>
                    ),
                  }}
                />
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Switch
                        name="public"
                        {...register('public')}
                        color="primary"
                      />
                    }
                    label="Organized group tour"
                    labelPlacement="end"
                  />
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              {coordinates.length > 0 && (
                <Map
                  coordinates={coordinates as unknown as LatLngExpression[][]}
                />
              )}
            </Grid>
          </Grid>
          <Grid xs={6} container item>
            <GroupTour />
          </Grid>
          <Button
            sx={{ mt: '2%' }}
            variant="contained"
            onClick={handleFormSubmit}
          >
            CREATE
          </Button>
        </Grid>
      </Paper>
      <DevTool control={control} />
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
        id: true,
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

export default CreateRoute;
