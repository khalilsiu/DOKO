import { ReactElement, cloneElement, useContext, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext';
import { LargeScreen } from './LargeScreen';
import { SmallScreen } from './SmallScreen';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return cloneElement(children, {
    elevation: trigger ? 2 : 0,
    style: {
      background: trigger ? 'black' : 'transparent',
    },
  });
}

const ResponsiveToolbar = withStyles((theme) => ({
  root: {
    paddingTop: 24,
    paddingBottom: 24,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
}))(Toolbar);

const useStyles = makeStyles(() => ({
  headerContainer: {
    transition: 'background linear 0.1s',
  },
}));

export const Header = () => {
  const { connect, loading, address } = useContext(AuthContext) as AuthContextType;
  const styles = useStyles();
  const [search, setSearch] = useState('');

  return (
    <ElevationScroll>
      <AppBar position="sticky" color="transparent" className={styles.headerContainer}>
        <ResponsiveToolbar>
          <Hidden smDown>
            <LargeScreen {...{ connect, loading, address, search, setSearch }} />
          </Hidden>
          <Hidden mdUp>
            <SmallScreen {...{ connect, loading, address, search, setSearch }} />
          </Hidden>
        </ResponsiveToolbar>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
