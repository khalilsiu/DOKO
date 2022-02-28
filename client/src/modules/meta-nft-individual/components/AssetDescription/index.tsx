import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Asset } from 'store/summary';
import { AssetImage } from './AssetImage';
import { PriceSection } from './PriceSection';

interface Props {
  asset: Asset;
}

export const AssetDescription = React.memo<Props>(({ asset }) => {
  const classes = useStyles();
  console.log('asset', asset);

  return (
    <Grid className={classes.root} container>
      <Grid className={classes.leftSection} item xs={12} sm={6} md={5}>
        <AssetImage imageUrl={asset.imageUrl} />
      </Grid>
      <Grid item xs={12} sm={6} md={7}>
        <PriceSection
          floorPriceEth={asset.floorPriceEth}
          floorPriceUsd={asset.floorPriceUsd}
          lastPurchasePriceEth={asset.lastPurchasePriceEth}
          lastPurchasePriceUsd={asset.lastPurchasePriceUsd}
        />
      </Grid>
    </Grid>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  leftSection: {
    paddingRight: theme.spacing(4),
  },
}));
