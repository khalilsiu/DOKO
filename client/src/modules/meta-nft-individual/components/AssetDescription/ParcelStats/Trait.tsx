import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { Trait as TraitType } from 'store/summary';

interface Props {
  trait: TraitType;
}

export const Trait = React.memo<Props>(({ trait: { traitType, value } }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography className={classes.label} variant="body2">
        {traitType}
      </Typography>
      <Typography className={classes.value} variant="body1">
        {value}
      </Typography>
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    border: 'solid 1px rgba(255,255,255,0.5)',
    borderRadius: 15,
    minWidth: 200,
    width: 200,
    padding: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  value: {
    color: 'white',
    fontWeight: 'bold',
  },
}));
