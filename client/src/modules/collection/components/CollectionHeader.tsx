import { Grid, IconButton, makeStyles, Tab, Tabs, Typography, withStyles } from '@material-ui/core';

import CopyAddress from '../../../components/CopyAddress';
import PriceField from '../../../components/PriceField';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    padding: '36px 96px',
  },
  collectionAvatar: {
    borderRadius: '50%',
    border: '4px solid white',
    background: theme.palette.primary.light,
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  detailContainer: {
    position: 'relative',
  },
  detailContent: {
    position: 'absolute',
    right: 0,
    bottom: 16,
    width: 'unset',
  },
}));

const CustomTypography = withStyles(() => ({
  root: {
    fontFamily: 'OpenSans',
  },
}))(Typography);

const CustomTabs = withStyles({
  root: {
    width: '100%',
    marginTop: 24,
  },
  flexContainer: {
    borderBottom: '2px solid #46324a',
  },
})(Tabs);

const CustomTab = withStyles({
  wrapper: {
    textTransform: 'none',
  },
  textColorPrimary: {
    color: 'white',
  },
})(Tab);

interface Props {
  collection: any;
  tab: number;
  setTab: any;
}

export default function CollectionHeader({ collection, tab, setTab }: Props) {
  const styles = useStyles();

  return (
    <Grid className={styles.headerContainer}>
      <Grid container justifyContent="flex-end" spacing={1}>
        <Grid item>
          <a
            href={`https://opensea.io/collection/${collection.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            <IconButton>
              <img width={36} src="/collection/DOKOasset_OpenSea.png" alt="" />
            </IconButton>
          </a>
        </Grid>
        <Grid item>
          <a
            href={`https://etherscan.io/address/${collection.primary_asset_contracts[0].address}`}
            target="_blank"
            rel="noreferrer"
          >
            <IconButton>
              <img width={36} src="/collection/DOKOasset_EtherScan.png" alt="" />
            </IconButton>
          </a>
        </Grid>
        <Grid item>
          <IconButton onClick={() => window.location.reload()}>
            <img width={36} src="/collection/DOKOasset_RefreshData.png" alt="" />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton>
            <img width={36} src="/collection/DOKOasset_ShareWhiteCircle.png" alt="" />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item>
          <img
            className={styles.collectionAvatar}
            src={collection.image_url}
            alt=""
            width="100%"
            height="100%"
          />
        </Grid>
        <Grid item style={{ flex: 1 }}>
          <CustomTypography variant="h3" style={{ fontWeight: 700 }}>
            {collection.name}
          </CustomTypography>
          <span style={{ display: 'inline-flex' }}>
            <CopyAddress address={collection.primary_asset_contracts[0].address} />
          </span>
          <Grid className={styles.detailContainer}>
            <CustomTabs
              indicatorColor="primary"
              textColor="primary"
              value={tab}
              onChange={(event, newValue) => setTab(newValue)}
            >
              <CustomTab style={{ fontWeight: 'bolder' }} label="Collection" value={0} />
              <CustomTab style={{ fontWeight: 'bolder' }} label="Data" value={1} />
            </CustomTabs>
            <Grid className={styles.detailContent} container spacing={3}>
              <Grid item>
                <Typography variant="subtitle2">Items</Typography>
                <Typography variant="h5" style={{ fontWeight: 700 }}>
                  {collection.stats.total_supply || 0}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">Owners</Typography>
                <Typography variant="h5" style={{ fontWeight: 700 }}>
                  {collection.stats.num_owners || 0}
                </Typography>
              </Grid>
              <Grid item>
                <PriceField title="Floor Price" value={collection.stats.floor_price} />
              </Grid>
              <Grid item>
                <PriceField title="All-time volume" value={collection.stats.total_volume} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
