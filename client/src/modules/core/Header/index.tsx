import { cloneElement, useContext, useState } from 'react';
import {
  AppBar,
  Hidden,
  makeStyles,
  Toolbar,
  useScrollTrigger,
  withStyles
} from '@material-ui/core';

import { AuthContext } from '../../../contexts/AuthContext';
import { LargeScreen } from './LargeScreen';
import { SmallScreen } from './SmallScreen';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  return cloneElement(children, {
    elevation: trigger ? 2 : 0,
    style: {
      background: trigger ? 'black' : 'transparent'
    }
  });
}

const ResponsiveToolbar = withStyles(theme => ({
  root: {
    paddingTop: 24,
    paddingBottom: 24,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 8,
      paddingBottom: 8
    }
  }
}))(Toolbar);

export const Header = () => {
  const { login, loading, address } = useContext(AuthContext);
  const styles = useStyles();
  const [search, setSearch] = useState('');

  return (
    <ElevationScroll>
      <AppBar position="sticky" color="transparent" className={styles.headerContainer}>
        <ResponsiveToolbar>
          <Hidden smDown>
            <LargeScreen {...{ login, loading, address, search, setSearch }} />
          </Hidden>
          <Hidden mdUp>
            <SmallScreen {...{ login, loading, address, search, setSearch }} />
          </Hidden>
        </ResponsiveToolbar>
      </AppBar>
    </ElevationScroll>
  );
};

const useStyles = makeStyles(() => ({
  headerContainer: {
    transition: 'background linear 0.1s'
  }
}));
