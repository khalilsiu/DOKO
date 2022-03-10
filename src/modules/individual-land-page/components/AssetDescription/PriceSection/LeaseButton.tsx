import { Button, makeStyles } from '@material-ui/core';
import React from 'react';

export const LeaseButton = React.memo(() => {
  const classes = useStyles();
  const onClick = React.useCallback(() => {
    alert('TODO');
  }, []);

  return (
    <Button onClick={onClick} className={classes.root}>
      Lease
    </Button>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: 130,
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(4),
    border: `solid 2px ${theme.palette.primary.main}`,
    backgroundClip: 'padding-box',
    color: theme.palette.primary.main,
  },
}));
