import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { Trait as TraitType } from 'store/summary/profileOwnershipSlice';
import { startCase } from 'lodash';

interface Props {
  trait: TraitType;
}

export const Trait = React.memo<Props>(({ trait: { traitType, value } }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography className={classes.label} variant="body2">
        {startCase(traitType)}
      </Typography>
      <Typography className={classes.value} variant="body1">
        {String(value).length < 10 || isNaN(Number(value)) ? value : Number(value).toFixed(8)}
      </Typography>
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    border: 'solid 1px rgba(255,255,255,0.5)',
    borderRadius: 15,
    minWidth: 180,
    width: 180,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&:last-child': {
      marginRight: '0 !important',
    },
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 100,
      width: 100,
      marginRight: theme.spacing(1),
    },
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      height: 40,
      fontSize: '0.8rem',
    },
  },
  value: {
    color: 'white',
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
  },
}));
