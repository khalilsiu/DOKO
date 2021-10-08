import {
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  MenuList,
  Tab,
  Tabs,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Popover } from '../../../components';

import CopyAddress from '../../../components/CopyAddress';
import PriceField from '../../../components/PriceField';
import facebook from '../../../components/assets/facebook.png';
import twitter from '../../../components/assets/twitter.png';

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
  shareItem: {
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
    '& > img': {
      width: 24,
      marginRight: 12,
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
          <Popover
            reference={
              <IconButton>
                <img width={36} src="/collection/DOKOasset_ShareWhiteCircle.png" alt="" />
              </IconButton>
            }
            placement="bottom-end"
          >
            <MenuList>
              <MenuItem className={styles.shareItem} onClick={() => share('facebook')}>
                <img src={facebook} alt="facebook" />
                Share on Facebook
              </MenuItem>
              <MenuItem className={styles.shareItem} onClick={() => share('twitter')}>
                <img src={twitter} alt="twitter" />
                Share on Twitter
              </MenuItem>
            </MenuList>
          </Popover>
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
                <PriceField title="All-Time volume" value={collection.stats.total_volume} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
