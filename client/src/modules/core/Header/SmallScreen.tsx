import { Grid, IconButton } from '@material-ui/core';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import { ToolbarItemsProps } from './types';
import { DrawerContext } from '../../../contexts/DrawerContext';

export const SmallScreen = ({}: ToolbarItemsProps) => {
  const { toggle } = useContext(DrawerContext);

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid xs={4} item>
        <IconButton edge="start" style={{ color: 'white' }} onClick={toggle}>
          <MenuIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/GRADIENT_LOGO.png" height={36} alt="" />
        </Link>
      </Grid>
      <Grid xs={4} item>
        <Grid container justifyContent="flex-end">
          <IconButton edge="start" style={{ color: 'white' }}>
            <SearchIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
