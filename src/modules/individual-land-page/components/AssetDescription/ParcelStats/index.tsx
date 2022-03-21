import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Trait as TraitType } from 'store/profile/profileOwnershipSlice';
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
      <Box>
        <Box className={classes.traits}>
          {traits.map((trait, key) => (
            <Trait trait={trait} key={key} />
          ))}
        </Box>
      </Box>
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
  },
}));
