import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Asset } from 'store/summary';
import { AssetImage } from './AssetImage';
import { PriceSection } from './PriceSection';
import { pick } from 'lodash';

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
          {...pick(asset, [
            'floorPriceEth',
            'floorPriceUsd',
            'lastPurchasePriceEth',
            'lastPurchasePriceUsd',
          ])}
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
