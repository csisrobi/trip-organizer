import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { SessionProvider } from 'next-auth/react';
import { Box, CssBaseline, StyledEngineProvider } from '@mui/material';
import { Layout } from '../src/components/Layout';
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session} refetchInterval={0}>
      <StyledEngineProvider injectFirst>
        <CssBaseline>
          <SnackbarProvider maxSnack={3}>
            <Box sx={{}}>
              {(Component as any).authPage ? (
                <Component {...pageProps} />
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </Box>
          </SnackbarProvider>
        </CssBaseline>
      </StyledEngineProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);
