import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Grid, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { useMetaMask } from 'metamask-react';

import { setUser } from '../../../store/reducers/auth';
import { State } from '../../../store';
import { User } from '../../../interfaces';
import { HeaderUserButton } from './HeaderUserButton';
import Logo from './DOKO_LOGO_COLOUR.png';
import { indexAddress } from '../../api';
import { config } from '../../../config';

export const Header = () => {
  const dispatch = useDispatch();
  const { account, connect } = useMetaMask();
  const user = useSelector<State, User>(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const styles = useStyles();

  const logout = async () => {};

  const userLogin = async () => {
    setLoading(true);

    await connect();

    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      setUser({
        address: account
      })
    );

    if (account) {
      indexAddress(account);
    }
  }, [account, dispatch]);

  return (
    <AppBar position="static" color="transparent" className={styles.headerContainer}>
      <Toolbar style={{ paddingTop: 8, paddingBottom: 8 }}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item style={{ marginTop: 4 }}>
            <img src={Logo} width={48} alt="" />
          </Grid>
          <Grid item>
            <Typography variant="h3" style={{ fontWeight: 800 }}>
              DOKO
            </Typography>
          </Grid>
        </Grid>
        <HeaderUserButton
          loading={loading}
          address={user.address}
          onLogin={userLogin}
          onLogout={logout}
        />
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles(() => ({
  headerContainer: {
    boxShadow: 'none'
  }
}));
