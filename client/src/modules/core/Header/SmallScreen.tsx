import { useContext, useState } from 'react';
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import { ToolbarItemsProps } from './types';
import { DrawerContext } from '../../../contexts/DrawerContext';
import { RadiusInput } from '../../../components';

const useStyles = makeStyles((theme: Theme) => ({
  flexAnimationItem: {
    opacity: 1,
    overflow: 'hidden',
    transition: theme.transitions.create('all'),
  },
  hideItem: {
    opacity: 0,
    maxWidth: '0 !important',
  },
}));

export const SmallScreen = ({ search, setSearch }: ToolbarItemsProps) => {
  const { toggle } = useContext(DrawerContext);
  const history = useHistory();
  const [showSearch, setShowSearch] = useState(false);
  const styles = useStyles();
  const handleSearch = () => {
    setShowSearch(false);
    history.push(`/address/${search}`);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid
        className={`${styles.flexAnimationItem} ${showSearch ? styles.hideItem : ''}`}
        xs={4}
        item
      >
        <IconButton edge="start" style={{ color: 'white' }} onClick={toggle}>
          <MenuIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/GRADIENT_LOGO.png" height={36} alt="" />
        </Link>
      </Grid>
      <Grid className={styles.flexAnimationItem} xs={showSearch ? true : 4} item>
        <Grid wrap="nowrap" container justifyContent="flex-end" alignItems="center">
          {showSearch ? (
            <>
              <Grid item style={{ marginRight: 12 }}>
                <FormControl>
                  <RadiusInput
                    style={{ minWidth: 200 }}
                    placeholder="Search by Address"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => search && e.key === 'Enter' && handleSearch()}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon color="action" fontSize="small" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <IconButton
                  style={{ color: 'white', padding: 0 }}
                  onClick={() => setShowSearch(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </>
          ) : (
            <IconButton style={{ color: 'white', padding: 0 }} onClick={() => setShowSearch(true)}>
              <SearchIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SmallScreen;
