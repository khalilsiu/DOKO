import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { AssetImage } from './AssetImage';
import { PriceSection } from './PriceSection';
import { ParcelStats } from './ParcelStats';
import { DescriptionSection } from './DescriptionSection';
import { useParams } from 'react-router-dom';
import { Asset } from 'store/summary/profileOwnershipSlice';

interface Props {
  asset: Asset;
}

export const AssetDescription = React.memo<Props>(({ asset }) => {
  const classes = useStyles();
  const { address, id } = useParams<{ address: string; id: string; chain: string }>();

  return (
    <Grid className={classes.root} container>
      <Grid className={classes.leftSection} item xs={12} sm={3} lg={4} xl={5}>
        <AssetImage imageUrl={asset.imageUrl} />
      </Grid>
      <Grid item xs={12} sm={9} lg={8} xl={7}>
        <PriceSection
          floorPriceEth={asset.floorPriceEth}
          floorPriceUsd={asset.floorPriceUsd}
          lastPurchasePriceEth={asset.lastPurchasePriceEth}
          lastPurchasePriceUsd={asset.lastPurchasePriceUsd}
        />
        <ParcelStats traits={asset.traits} />
        <DescriptionSection
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
    [theme.breakpoints.down('xs')]: {
      paddingRight: 0,
    },
  },
}));
