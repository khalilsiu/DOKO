import React from 'react';
import { PriceBox } from './PriceBox';
import { Grid, makeStyles } from '@material-ui/core';
import { Asset } from 'store/summary';
import { LeaseButton } from './LeaseButton';

type Props = Pick<
  Asset,
  'floorPriceEth' | 'floorPriceUsd' | 'lastPurchasePriceEth' | 'lastPurchasePriceUsd'
>;

export const PriceSection = React.memo<Props>(
  ({ floorPriceEth, floorPriceUsd, lastPurchasePriceEth, lastPurchasePriceUsd }) => {
    const classes = useStyles();

    return (
      <Grid className={classes.root} container>
        <Grid item>
          <Grid container>
            <PriceBox
              title="Last Purchase Price"
              priceETH={lastPurchasePriceEth}
              priceUSD={lastPurchasePriceUsd}
            />
            <PriceBox
              title="Current Floor Price"
              priceETH={floorPriceEth}
              priceUSD={floorPriceUsd}
            />
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
