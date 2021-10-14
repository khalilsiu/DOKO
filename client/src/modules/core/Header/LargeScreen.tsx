import { FormControl, Grid, InputAdornment, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useHistory } from 'react-router-dom';

import { RadiusInput } from '../../../components';
import { HeaderUserButton } from './HeaderUserButton';
import { ToolbarItemsProps } from './types';

export const LargeScreen = ({
  setSearch,
  search,
  loading,
  address,
  connect,
}: ToolbarItemsProps) => {
  const history = useHistory();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid xs={4} item>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="/DOKO_Lockup.png" height={36} alt="" />
          </Link>
        </Grid>
        <Grid item>
          <FormControl>
            <RadiusInput
              style={{ minWidth: 300 }}
              placeholder="Search by Address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={
                (e) =>
                  // eslint-disable-next-line implicit-arrow-linebreak
                  search && e.key === 'Enter' && history.push(`/address/${search}`)
                // eslint-disable-next-line react/jsx-curly-newline
              }
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={4} item>
          <Grid container justifyContent="flex-end" alignItems="center">
            <Grid item>
              <a
                style={{ textDecoration: 'none', display: 'block' }}
                className="hover-button"
                href="https://doko-one.gitbook.io/doko/"
                target="_blank"
                rel="noreferrer"
              >
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  About DOKO
                </Typography>
              </a>
            </Grid>
            <Grid item style={{ marginLeft: 36 }}>
              <HeaderUserButton loading={loading} address={address} connect={connect} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LargeScreen;
