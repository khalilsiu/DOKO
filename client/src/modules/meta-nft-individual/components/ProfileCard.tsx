import React from 'react';
import Intro from 'modules/core/Intro';
import { Card, makeStyles } from '@material-ui/core';

export const ProfileCard = React.memo(() => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Intro drawer={false} />
    </Card>
  );
});

const useStyles = makeStyles({
  root: {
    position: 'fixed',
  },
});
