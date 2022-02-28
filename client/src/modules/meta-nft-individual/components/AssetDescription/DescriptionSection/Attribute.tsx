import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Attribute = React.memo<Props>(({ title, children }) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root} item xs={6}>
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
  root: {
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 'bold',
  },
  value: {
    wordBreak: 'break-word',
    display: 'flex',
    alignItems: 'center',
  },
}));
