import { useContext, useState } from 'react';
import {
  AppBar,
  FormControl,
  Grid,
  InputAdornment,
  makeStyles,
  OutlinedInput,
  Toolbar,
  Typography
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Search } from '@material-ui/icons';

import { HeaderUserButton } from './HeaderUserButton';
import Logo from './DOKO_LOGO_COLOUR.png';
import { AuthContext } from '../../../contexts/AuthContext';

export const Header = () => {
  const { login, loading, address } = useContext(AuthContext);
  const styles = useStyles();
  const [search, setSearch] = useState('');
  const history = useHistory();

  const logout = async () => {};

  return (
    <AppBar position="static" color="transparent" className={styles.headerContainer}>
      <Toolbar style={{ paddingTop: 8, paddingBottom: 8 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item style={{ marginTop: 10 }}>
                <img src={Logo} width={48} alt="" />
              </Grid>
              <Grid item>
                <Typography variant="h3" style={{ fontWeight: 800 }}>
                  DOKO
                </Typography>
              </Grid>
            </Grid>
          </Link>
          <Grid>
            <FormControl>
              <OutlinedInput
                placeholder="Search your collection"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e =>
                  search && e.key === 'Enter' && history.push(`/collections/${search}`)
                }
                startAdornment={
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <HeaderUserButton loading={loading} address={address} onLogin={login} onLogout={logout} />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles(() => ({
  headerContainer: {
    boxShadow: 'none'
  }
}));
