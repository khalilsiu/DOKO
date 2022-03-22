import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Trait as TraitType } from 'store/summary/profileOwnershipSlice';
import { Trait } from './Trait';

interface Props {
  traits: TraitType[];
}

export const ParcelStats = React.memo<Props>(({ traits }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography className={classes.title} variant="h6">
        Parcel Stats
      </Typography>
      <Box className={classes.traits}>
        {traits.map((trait, key) => (
          <Trait trait={trait} key={key} />
        ))}
      </Box>
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    paddingTop: theme.spacing(2),
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
      fontSize: 18,
    },
  },
  traits: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    width: '100%',
    overflowX: 'auto',
    paddingBottom: theme.spacing(2),
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(1),
    },
  },
}));
