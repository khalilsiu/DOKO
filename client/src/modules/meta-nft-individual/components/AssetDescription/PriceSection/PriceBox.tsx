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
    <Grid className={classes.root} item>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      <Box className={classes.row}>
        <img
          className={classes.ethereumIcon}
          src="/collection/DOKOasset_EthereumBlue.png"
          alt="eth"
        />
        <Box className={classes.priceValueRow}>
          <Typography className={classes.ethPrice} variant="h4">
            {priceETH}
          </Typography>
          <Typography className={classes.usdPrice} variant="body1">
            (${priceUSD})
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(4),
    borderRight: '2px solid rgba(255,255,255,0.2)',
    [`&:last-child`]: {
      paddingLeft: theme.spacing(4),
      borderRight: 'none',
    },
  },
  title: {
    fontWeight: 'bold',
    fontSize: 21,
  },
  ethereumIcon: {
    width: 24,
    height: 'auto',
    marginRight: theme.spacing(1),
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
    fontSize: 42,
  },
  usdPrice: {
    fontStyle: 'italic',
  },
}));
