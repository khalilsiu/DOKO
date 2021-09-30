import { Grid, IconButton, makeStyles, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import CopyAddress from '../../../components/CopyAddress';
import PriceField from '../../../components/PriceField';
import { ICollection } from '../types';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    padding: '36px 96px',
  },
  collectionAvatar: {
    borderRadius: '50%',
    border: '4px solid white',
    background: theme.palette.primary.light,
    minWidth: 200,
    minHeight: 200,
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
  collection: ICollection;
  tab: number;
  setTab: any;
}

export default function CollectionHeader({ collection, tab, setTab }: Props) {
  const styles = useStyles();

  return (
    <Grid className={styles.headerContainer}>
      <Grid container justifyContent="flex-end" spacing={1}>
        <Grid item>
          <a href={`https://opensea.io/collection/${collection.collection.slug}`}>
            <IconButton>
              <img width={36} src="/collection/DOKOasset_OpenSea.png" alt="" />
            </IconButton>
          </a>
        </Grid>
        <Grid item>
          <a href={`https://etherscan.io/address/${collection.address}`}>
            <IconButton>
              <img width={36} src="/collection/DOKOasset_EtherScan.png" alt="" />
            </IconButton>
          </a>
        </Grid>
        <Grid item>
          <IconButton>
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
          <div className={styles.collectionAvatar}>
            {/* <img src={collection.collection.image_url} alt="" width="100%" height="100%" /> */}
          </div>
        </Grid>
        <Grid item style={{ flex: 1 }}>
          <CustomTypography variant="h3" style={{ fontWeight: 700 }}>
            {collection.name}
          </CustomTypography>
          <span style={{ display: 'inline-flex' }}>
            <CopyAddress address={collection.address} />
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
                  {collection.items || 0}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">Owners</Typography>
                <Typography variant="h5" style={{ fontWeight: 700 }}>
                  {collection.owners || 0}
                </Typography>
              </Grid>
              <Grid item>
                <PriceField title="Floor Price" value={0} />
              </Grid>
              <Grid item>
                <PriceField title="All-time volume" value={collection.total_volume} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
