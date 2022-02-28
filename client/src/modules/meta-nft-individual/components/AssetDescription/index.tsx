import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Asset } from 'store/summary';
import { AssetImage } from './AssetImage';
import { PriceSection } from './PriceSection';
import { ParcelStats } from './ParcelStats';
import { DescriptionSection } from './DescriptionSection';
import { useParams } from 'react-router-dom';

interface Props {
  asset: Asset;
}

export const AssetDescription = React.memo<Props>(({ asset }) => {
  const classes = useStyles();
  const { address, id } = useParams<{ address: string; id: string; chain: string }>();

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
        <ParcelStats traits={asset.traits} />
        <DescriptionSection
          district="N/A"
          tokenId={id}
          contactAddress={address}
          mataverseName={asset.metaverseName}
          tokenStandard={asset.tokenStandard}
          externalLink={asset.externalLink}
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
