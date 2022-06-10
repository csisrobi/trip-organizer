import fetcher from './fetcher';

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
