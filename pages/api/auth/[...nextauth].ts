/* eslint-disable import/no-anonymous-default-export */
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import { authLogin } from '../../../lib/mutations';
import { SessionStrategy } from 'next-auth';
import cookie from 'cookie';

const nextAuthOptions = (req: NextApiRequest, res: NextApiResponse) => {
  return {
    session: {
      strategy: 'jwt' as SessionStrategy,
      maxAge: 8 * 60 * 60,
    },
    providers: [
      CredentialsProvider({
        credentials: {
          email: { type: 'text' },
          password: { type: 'password' },
        },
        authorize: async (credentials) => {
          const user = await authLogin({
            password: credentials.password,
            email: credentials.email,
          });

          if (user.error) {
            res.status(401);
            throw Error(user.error);
          }

          return user;
        },
      }),
    ],
    secret: process.env.JWT_SECRET,
    pages: {
      signIn: '/login',
      signOut: '/login',
      error: '/login',
    },
    callbacks: {
      jwt: ({ token, user }) => {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      session: ({ session, token }) => {
        if (token) {
          session.id = token.id;
        }
        return session;
      },
    },
  };
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
