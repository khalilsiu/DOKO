import { PropsWithChildren } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#ff06d7',
    },
    secondary: {
      main: '#00ffef',
    },
    action: {
      disabled: '#666',
    },
    divider: 'rgba(255,255,255,0.5)',
  },
  typography: {
    fontFamily: 'OpenSans',
    h1: {
      fontFamily: 'Exo2',
    },
    h2: {
      fontFamily: 'Exo2',
    },
    h3: {
      fontFamily: 'Exo2',
    },
    h4: {
      fontFamily: 'Exo2',
    },
    h5: {
      fontFamily: 'Exo2',
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
        padding: '10.5px 14px',
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 60,
        background: 'white',
      },
      input: {
        padding: '10.5px 14px',
      },
    },
    MuiButton: {
      root: {
        borderRadius: 60,
        textTransform: 'unset',
        fontWeight: 600,
        fontFamily: 'OpenSans',
      },
    },
    MuiTypography: {
      root: {
        color: 'white',
      },
    },
    MuiMenuItem: {
      root: {
        '&.selected': {
          background: '#ff06d7',
          color: 'white',
          '.MuiTypography-root': {
            color: 'white',
          },
        },
      },
    },
    MuiList: {
      root: {
        padding: 0,
      },
    },
    MuiCard: {
      root: {
        borderRadius: 16,
      },
    },
    MuiDrawer: {
      paper: {
        borderTopRightRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
        height: '101%',
      },
    },
  },
});

export default function Palette({ children }: PropsWithChildren<any>) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
