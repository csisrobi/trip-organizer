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
            background: '#5f558d',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FCF0CA',
          border: '1px solid black',
          transition: 'all .2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#FCF0CA',
          border: '1px solid black'
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            backgroundColor: '#FCF0CA',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'black',
            },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#434870',
        },
      },
    },
  },
});
