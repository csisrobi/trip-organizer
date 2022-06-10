import { Stack, OutlinedInput, Button } from '@mui/material';
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { authRegister } from '../../../lib/mutations';
import { useSnackbar } from 'notistack';

const schema = yup
  .object({
    email: yup.string().required('This field is required'),
    firstName: yup.string().required('This field is required'),
    lastName: yup.string().required('This field is required'),
    password: yup.string().required('Password is required'),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  })
  .required();

export const RegisterComponent = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = useMemo(() => {
    return handleSubmit(({ firstName, password, email, lastName }) => {
      (async () => {
        const user = await authRegister({
          firstName,
          password,
          email,
          lastName,
        });
        if (!user.error) {
          router.replace('/login');
        } else {
          enqueueSnackbar(user.error, {
            variant: 'error',
          });
        }
      })();
    });
  }, [enqueueSnackbar, handleSubmit, router]);

  return (
    <Stack spacing={2} sx={{ width: '70%' }}>
      <Stack>
        <OutlinedInput
          {...register('email')}
          placeholder="Email"
          size="small"
          sx={{ backgroundColor: 'white' }}
          error={!!errors['email']}
        />
        {errors['email'] && (
          <Typography fontSize="12px" sx={{ color: 'red' }}>
            {errors['email'].message}
          </Typography>
        )}
      </Stack>
      <Stack>
        <OutlinedInput
          {...register('firstName')}
          placeholder="First name"
          size="small"
          sx={{ backgroundColor: 'white' }}
          error={!!errors['firstName']}
        />
        {errors['firstName'] && (
          <Typography fontSize="12px" sx={{ color: 'red' }}>
            {errors['firstName'].message}
          </Typography>
        )}
      </Stack>
      <Stack>
        <OutlinedInput
          {...register('lastName')}
          placeholder="Last name"
          size="small"
          sx={{ backgroundColor: 'white' }}
          error={!!errors['lastName']}
        />
        {errors['lastName'] && (
          <Typography fontSize="12px" sx={{ color: 'red' }}>
            {errors['lastName'].message}
          </Typography>
        )}
      </Stack>
      <Stack>
        <OutlinedInput
          {...register('password')}
          placeholder="Password"
          type="password"
          size="small"
          sx={{ backgroundColor: 'white' }}
          error={!!errors['password']}
        />
        {errors['password'] && (
          <Typography fontSize="12px" sx={{ color: 'red' }}>
            {errors['password'].message}
          </Typography>
        )}
      </Stack>
      <Stack>
        <OutlinedInput
          {...register('repeatPassword')}
          placeholder="Repeat password"
          type="password"
          size="small"
          sx={{ backgroundColor: 'white' }}
          error={!!errors['repeatPassword']}
        />
        {errors['repeatPassword'] && (
          <Typography fontSize="12px" sx={{ color: 'red' }}>
            {errors['repeatPassword'].message}
          </Typography>
        )}
      </Stack>
      <Button variant="contained" onClick={handleFormSubmit}>
        Register
      </Button>
      <Stack spacing={1} direction="row">
        <Typography>Already have an account?</Typography>
        <Link href={'/login'}>
          <a>Login</a>
        </Link>
      </Stack>
    </Stack>
  );
};
