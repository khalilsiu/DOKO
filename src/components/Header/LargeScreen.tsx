import { memo } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import RadiusInput from 'components/RadiusInput';
import { Link, useHistory } from 'react-router-dom';
import { HeaderUserButton } from './HeaderUserButton';
import { ToolbarItemsProps } from './types';
import DOKOLockup from 'assets/doko/doko-lockup.png';

export const LargeScreen = memo(({ setSearch, search, loading, address, connect }: ToolbarItemsProps) => {
  const history = useHistory();
  const { host } = window.location;
  let subdomain = '';
  const arr = host.split('.');
  if (arr.length > 0 && host.indexOf('staging') !== -1) {
    subdomain = arr[1];
  } else if (arr.length > 0) {
    subdomain = arr[0];
  }
  let link = 'https://doko-one.gitbook.io/doko/';
  if (subdomain !== 'nft') {
    link = 'https://doko-one.gitbook.io/doko-metaverse/';
  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid xs={4} item>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src={DOKOLockup} height={36} />
          </Link>
        </Grid>
        <Grid item>
          <FormControl>
            <RadiusInput
              style={{ minWidth: 300 }}
              placeholder="Search by Address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => search && e.key === 'Enter' && history.push(`/address/${search}`)}
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
                href={link}
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
});

export default LargeScreen;
