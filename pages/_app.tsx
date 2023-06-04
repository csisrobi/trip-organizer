import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { SessionProvider } from 'next-auth/react';
import {
  Box,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import { Layout } from '../src/components/Layout';
import { appWithTranslation } from 'next-i18next';
import { appTheme } from '../src/theme';
import { SWRConfig } from 'swr';
import fetcher from '../lib/fetcher';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ThemeProvider theme={appTheme}>
      <SessionProvider session={session} refetchInterval={0}>
        <StyledEngineProvider injectFirst>
          <CssBaseline>
            <SnackbarProvider maxSnack={3}>
              <SWRConfig
                value={{
                  //TODO: PUT IT BACK
                  //refreshInterval: 5000,
                  fetcher,
                }}
              >
                <Box sx={{}}>
                  {(Component as any).authPage ? (
                    <Component {...pageProps} />
                  ) : (
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  )}
                </Box>
              </SWRConfig>
            </SnackbarProvider>
          </CssBaseline>
        </StyledEngineProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp);
