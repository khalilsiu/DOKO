import React from 'react';
import { PriceBox } from './PriceBox';
import { Grid, makeStyles } from '@material-ui/core';
import { LeaseButton } from './LeaseButton';
import { Asset } from 'store/summary/profileOwnershipSlice';

type Props = Pick<Asset, 'floorPriceInEth' | 'floorPriceInUsd' | 'lastPurchasePriceEth' | 'lastPurchasePriceUsd'>;

export const PriceSection = React.memo<Props>(
  ({ floorPriceInEth, floorPriceInUsd, lastPurchasePriceEth, lastPurchasePriceUsd }) => {
    const classes = useStyles();

    return (
      <Grid className={classes.root} container>
        <Grid item>
          <Grid container>
            <PriceBox title="Last Purchase Price" priceETH={lastPurchasePriceEth} priceUSD={lastPurchasePriceUsd} />
            <PriceBox title="Current Floor Price" priceETH={floorPriceInEth} priceUSD={floorPriceInUsd} />
          </Grid>
          <Grid item>
            <LeaseButton />
          </Grid>
        </Grid>
      </Grid>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(4),
    borderBottom: '2px solid rgba(255,255,255,0.2)',
  },
}));
