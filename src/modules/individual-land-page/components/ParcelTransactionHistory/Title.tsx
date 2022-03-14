import React from 'react';
import { Hidden, makeStyles, Typography } from '@material-ui/core';

export const Title = React.memo(() => {
  const classes = useStyles();

  return (
    <Typography className={classes.root} variant="h5">
      <Hidden smDown>Parcel Transaction History</Hidden>
      <Hidden mdUp>Transaction History</Hidden>
    </Typography>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
      marginBottom: theme.spacing(2),
      fontSize: '2em',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '1.5em',
    },
  },
}));
