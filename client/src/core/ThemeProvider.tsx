import { createTheme, ThemeProvider } from '@material-ui/core';
import { PropsWithChildren } from 'react';

const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ff06d7'
    },
    secondary: {
      main: '#00ffef'
    }
  },
  typography: {
    fontFamily: 'OpenSans',
    h1: {
      fontFamily: 'Exo2'
    },
    h2: {
      fontFamily: 'Exo2'
    },
    h3: {
      fontFamily: 'Exo2'
    },
    h4: {
      fontFamily: 'Exo2'
    },
    h5: {
      fontFamily: 'Exo2'
    }
  },
  overrides: {
    MuiInputBase: {
      input: {
        padding: '10.5px 14px'
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 60,
        background: 'white'
      },
      input: {
        padding: '10.5px 14px'
      }
    }
  }
});

export default function Palette({ children }: PropsWithChildren<{}>) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
