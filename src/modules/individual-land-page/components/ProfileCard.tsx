import React from 'react';

import { Card, makeStyles } from '@material-ui/core';
import Intro from 'components/Intro';

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
