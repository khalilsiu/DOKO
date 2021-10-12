import { Grid, makeStyles, Tab, Tabs, Typography, withStyles, Hidden } from '@material-ui/core';
import CollectionActions from './CollectionActions';

import CopyAddress from '../../../components/CopyAddress';
import PriceField from '../../../components/PriceField';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    padding: '36px 96px',
    [theme.breakpoints.down('sm')]: {
      padding: 36,
    },
  },
  collectionAvatar: {
    borderRadius: '50%',
    border: '4px solid white',
    background: theme.palette.primary.light,
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  collectionName: {
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  detailContainer: {
    position: 'relative',
    width: '100%',
  },
  detailContent: {
    position: 'absolute',
    right: 0,
    bottom: 16,
    width: 'unset',
    [theme.breakpoints.down('md')]: {
      position: 'unset',
      marginTop: 24,
      marginBottom: 24,
    },
  },
  detailContentItem: {},
  detailContentItemContent: {
    [theme.breakpoints.down('md')]: {
      border: '2px solid #aaa',
      borderRadius: 12,
      width: '100%',
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
  const share = (type: 'facebook' | 'twitter') => {
    const url = `${window.origin}/collections/${collection.primary_asset_contracts[0].address}`;
    const link = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=Check out ${collection.name} collection on DOKO at now!`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check out ${collection.name} collection on @doko_nft now! ${url}`,
      instagram: '',
    };
    window.open(link[type], '_blank');
  };

  return (
    <Grid className={styles.headerContainer}>
      <Hidden mdDown>
        <CollectionActions collection={collection} onShare={share} />
      </Hidden>
      <Grid container spacing={2} className={styles.collectionName}>
        <Grid item>
          <img
            className={styles.collectionAvatar}
            src={collection.image_url}
            alt=""
            width="100%"
            height="100%"
          />
        </Grid>
        <Grid item style={{ flex: 1, width: '100%' }}>
          <Grid container direction="column" className={styles.collectionName}>
            <CustomTypography variant="h3" style={{ fontWeight: 700 }}>
              {collection.name}
            </CustomTypography>
            <Grid item>
              <CopyAddress address={collection.primary_asset_contracts[0].address} />
            </Grid>
            <Hidden lgUp>
              <Grid item style={{ marginTop: 24 }}>
                <CollectionActions collection={collection} onShare={share} />
              </Grid>
            </Hidden>
            <Grid className={styles.detailContainer}>
              <Grid
                className={styles.detailContent}
                container
                spacing={3}
                justifyContent="space-between"
              >
                <Grid item className={styles.detailContentItem} xs={6} md={3} lg="auto">
                  <Grid container direction="column" className={styles.detailContentItemContent}>
                    <Typography variant="subtitle2">Items</Typography>
                    <Typography variant="h5" style={{ fontWeight: 700 }}>
                      {collection.stats.total_supply || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item className={styles.detailContentItem} xs={6} md={3} lg="auto">
                  <Grid container direction="column" className={styles.detailContentItemContent}>
                    <Typography variant="subtitle2">Owners</Typography>
                    <Typography variant="h5" style={{ fontWeight: 700 }}>
                      {collection.stats.num_owners || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item className={styles.detailContentItem} xs={12} sm={6} md={3} lg="auto">
                  <Grid container direction="column" className={styles.detailContentItemContent}>
                    <PriceField title="Floor Price" value={collection.stats.floor_price} />
                  </Grid>
                </Grid>
                <Grid item className={styles.detailContentItem} xs={12} sm={6} md={3} lg="auto">
                  <Grid container direction="column" className={styles.detailContentItemContent}>
                    <PriceField title="All-Time volume" value={collection.stats.total_volume} />
                  </Grid>
                </Grid>
              </Grid>
              <CustomTabs
                indicatorColor="primary"
                textColor="primary"
                value={tab}
                onChange={(event, newValue) => setTab(newValue)}
              >
                <CustomTab style={{ fontWeight: 'bolder' }} label="Collection" value={0} />
                <CustomTab style={{ fontWeight: 'bolder' }} label="Data" value={1} />
              </CustomTabs>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
