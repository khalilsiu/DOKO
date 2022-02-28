import React from 'react';
import { PriceBox } from './PriceBox';
import { Grid } from '@material-ui/core';
import { Asset } from 'store/summary';

export const PriceSection = React.memo<
  Pick<Asset, 'floorPriceEth' | 'floorPriceUsd' | 'lastPurchasePriceEth' | 'lastPurchasePriceUsd'>
>(({ floorPriceEth, floorPriceUsd, lastPurchasePriceEth, lastPurchasePriceUsd }) => {
  return (
    <Grid container>
      <PriceBox
        title="Last Purchase Price"
        priceETH={lastPurchasePriceEth}
        priceUSD={lastPurchasePriceUsd}
      />
      <PriceBox title="Current Floor Price" priceETH={floorPriceEth} priceUSD={floorPriceUsd} />
    </Grid>
  );
});
