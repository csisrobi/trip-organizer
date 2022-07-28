import fetcher from './fetcher';
import formDataFetcher from './formDataFetcher';

export const authLogin = (body: { email: string; password: string }) =>
  fetcher('/login', body);

export const authRegister = (body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => fetcher('/register', body);

export const getFile = (filename: string) =>
  fetcher(`/file?filename=${filename}`);

export const changeSettings = (body: FormData) =>
  formDataFetcher('/settings', body);

export const createRoute = (body: FormData) => formDataFetcher('/route', body);

export const joinRoute = (body: { userId: number; routeId: number }) =>
  fetcher('/route/join', body);

export const payRoute = (body: { stripePrice: string; routeId: number }) =>
  fetcher('/payment', body);

export const createComment = (body: {
  userId: number;
  routeId: number;
  content: string;
}) => fetcher('/route/comment', body);

export const readNotification = (
  props: number | 'all',
  body?: { userId: number },
) => fetcher(`/notification/read/${props}`, body);
