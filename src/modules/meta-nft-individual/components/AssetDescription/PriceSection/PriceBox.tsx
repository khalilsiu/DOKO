import React from 'react';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';

interface Props {
  title: string;
  priceETH: number | null;
  priceUSD: number | null;
}

export const PriceBox = React.memo<Props>(({ priceETH, priceUSD, title }) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root} item xs={12} sm={6}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      <Box className={classes.row}>
        <img className={classes.ethereumIcon} src="/collection/DOKOasset_EthereumBlue.png" alt="eth" />
        <Box className={classes.priceValueRow}>
          <Typography className={classes.ethPrice} variant="h4">
            {priceETH || 'N/A'}
          </Typography>
          <Typography className={classes.usdPrice} variant="body1">
            ({priceUSD ? `$${priceUSD}` : 'N/A'})
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 240,
    paddingRight: theme.spacing(4),
    borderRight: '2px solid rgba(255,255,255,0.2)',
    [theme.breakpoints.down('lg')]: {
      paddingRight: theme.spacing(3),
      minWidth: 220,
    },
    [theme.breakpoints.down('xs')]: {
      paddingRight: 0,
      borderRight: 'none',
      paddingTop: theme.spacing(2),
    },
    [`&:last-child`]: {
      paddingLeft: theme.spacing(4),
      borderRight: 'none',
      [theme.breakpoints.down('lg')]: {
        paddingLeft: theme.spacing(3),
      },
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
      },
    },
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  ethereumIcon: {
    width: 20,
    height: 'auto',
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: 16,
    },
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  priceValueRow: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  ethPrice: {
    fontWeight: 'bold',
    paddingRight: theme.spacing(2),
    fontSize: 36,
    [theme.breakpoints.down('lg')]: {
      fontSize: 28,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 32,
    },
  },
  usdPrice: {
    fontStyle: 'italic',
    [theme.breakpoints.down('lg')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    },
  },
}));
