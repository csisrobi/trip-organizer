import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session} refetchInterval={0}>
      <SnackbarProvider maxSnack={3}>
        <Component {...pageProps} />
      </SnackbarProvider>
    </SessionProvider>
  );
}

export default MyApp;
