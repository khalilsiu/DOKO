import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Attribute = React.memo<Props>(({ title, children }) => {
  const classes = useStyles();

  return (
    <Grid item xs={6}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      <Typography className={classes.value} variant="body1">
        {children}
      </Typography>
    </Grid>
  );
});

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bold',
    [theme.breakpoints.down('lg')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    },
  },
  value: {
    wordBreak: 'break-word',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
}));
