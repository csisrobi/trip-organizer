import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          display: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'black',
          backgroundColor: '#ad78a4',
          '&:hover': {
            background: '#fcf0ca',
          },
        },
      },
    },
  },
});
