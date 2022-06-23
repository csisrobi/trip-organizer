import fetcher from './fetcher';
import formDataFetcher from './formDataFetcher';

export const authLogin = (body: { email: string; password: string }) => {
  return fetcher('/login', body);
};

export const authRegister = (body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  return fetcher('/register', body);
};

export const changeSettings = (body: any) => {
  return formDataFetcher('/settings', body);
};
