import {
  Stack,
  OutlinedInput,
  Grid,
  Checkbox,
  Typography,
  Button,
} from '@mui/material';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { signIn } from 'next-auth/react';

export const LoginComponent = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = useMemo(() => {
    return handleSubmit(({ password, email }) => {
      (async () => {
        const auth = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (!auth.error) {
          router.replace('/');
        } else {
          enqueueSnackbar(auth.error, {
            variant: 'error',
          });
        }
      })();
    });
  }, [enqueueSnackbar, handleSubmit, router]);

  return (
    <Stack spacing={3} sx={{ width: '70%' }}>
      <Stack>
        <OutlinedInput
          {...register('email', { required: 'This field is required' })}
          placeholder="Email"
          size="small"
          sx={{ backgroundColor: 'white' }}
        />
        {errors['email'] && (
          <Typography fontSize="12px" sx={{ color: 'red' }}>
            {errors['email'].message}
          </Typography>
        )}
      </Stack>
      <Stack>
        <OutlinedInput
          {...register('password', { required: 'This field is required' })}
          placeholder="Password"
          type="password"
          size="small"
          sx={{ backgroundColor: 'white' }}
        />
        {errors['password'] && (
          <Typography fontSize="12px" sx={{ color: 'red' }}>
            {errors['password'].message}
          </Typography>
        )}
      </Stack>
      <Button variant="contained" onClick={handleFormSubmit}>
        Login
      </Button>
      <Stack spacing={1} direction="row">
        <Typography>{"Don't have an account?"}</Typography>
        <Link href={'/register'}>
          <a>Register</a>
        </Link>
      </Stack>
    </Stack>
  );
};
