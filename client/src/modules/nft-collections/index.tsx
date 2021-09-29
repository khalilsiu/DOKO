import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

import { NFTItem } from '../../components/NFTItem';
import { getAddressStatus, getNFTs, indexAddress } from '../api';
import { TabPanel } from '../../components/TabPanel';
import { Filter } from './Filter';
import Intro from '../core/Intro';
import { minimizeAddress } from '../../libs/utils';
import { AddressStatus } from './AddressStatus';

const CustomTabs = withStyles({
  root: {
    width: '100%',
  },
  flexContainer: {
    borderBottom: '2px solid #46324a',
  },
})(Tabs);

const CustomTab = withStyles({
  wrapper: {
    textTransform: 'none',
  },
})(Tab);

const CustomIconButton = withStyles({
  disabled: {
    color: '#333 !important',
  },
})(IconButton);

let syncInterval: any;

const useStyles = makeStyles((theme) => ({
  collectionContainer: {
    padding: 24,
    marginTop: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    minHeight: 'calc(100vh)',
  },
  introCard: {
    position: 'sticky',
    top: 120,
  },
  itemsContainer: {
    paddingLeft: 36,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
  nftsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: '1fr',
    columnGap: 12,
    rowGap: 12,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
}));

export const NftCollections = () => {
  const [loading, setLoading] = useState(false);
  const [nfts, setNFTs] = useState<any[]>([]);
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [filter, setFilter] = useState<any>({});
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  const fetchNfts = async (offset: number, reset = false) => {
    if (!address) {
      return;
    }
    setLoading(true);

    try {
      const res = await getNFTs(address, offset, filter);
      setNFTs((items) => (reset ? res.data : [...items, ...res.data]));
      setAllLoaded(res.data.length < 12);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    setLoading(false);
  };

  const loadMore = () => {
    fetchNfts(nfts.length);
  };

  const checkSyncStatus = async () => {
    try {
      const res = await getAddressStatus(address);
      const sync = res.data;

      if (sync?.sync_status === 'done' || sync?.sync_status === 'empty') {
        clearInterval(syncInterval);

        if (Date.now() / 1000 - sync.timestamp < 5000 && sync.sync_status === 'done') {
          fetchNfts(0, true);
        }
      }
      setSyncStatus(sync);
    } catch (err) {
      if (!syncStatus) {
        setSyncStatus({});
      }
    }
  };

  useEffect(() => () => clearInterval(syncInterval), []);

  useEffect(() => {
    clearInterval(syncInterval);
    setSyncStatus(null);

    if (!address) {
      return;
    }
    indexAddress(address);

    syncInterval = setInterval(() => checkSyncStatus(), 3000);
    checkSyncStatus();
  }, [address]);

  useEffect(() => {
    setNFTs([]);
    setAllLoaded(false);
    fetchNfts(0);
  }, [address, filter]);

  const copy = () => {
    if (copied) {
      return;
    }
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reIndex = () => {
    indexAddress(address, true);
    setSyncStatus(null);
    setNFTs([]);
    clearInterval(syncInterval);
    syncInterval = setInterval(() => checkSyncStatus(), 3000);
  };

  return (
    <Grid container wrap="nowrap" className={styles.collectionContainer}>
      <Hidden smDown>
        <Grid item>
          <Card className={styles.introCard}>
            <Intro drawer={false} />
          </Card>
        </Grid>
      </Hidden>
      <Grid className={styles.itemsContainer} container direction="column" alignItems="flex-start">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
              {minimizeAddress(address)}
              <Tooltip title="Refetch all of your nfts">
                <CustomIconButton
                  disabled={
                    !syncStatus ||
                    syncStatus.sync_status === 'progress' ||
                    syncStatus.sync_status === 'new'
                  }
                  onClick={() => reIndex()}
                  color="secondary"
                >
                  <RefreshOutlinedIcon />
                </CustomIconButton>
              </Tooltip>
            </Typography>
            <Tooltip title={copied ? 'Copied' : 'Copy'} placement="right">
              <Grid className="hover-button" container alignItems="center" onClick={() => copy()}>
                <Typography variant="h6" style={{ lineHeight: 2 }}>
                  {minimizeAddress(address)}
                </Typography>
                <IconButton>
                  <img height={13} src="/copy.png" alt="" />
                </IconButton>
              </Grid>
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <Hidden xsDown>
              <Grid container justifyContent="flex-end">
                <AddressStatus status={syncStatus} loader={false} />
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
        <CustomTabs
          indicatorColor="primary"
          textColor="primary"
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
        >
          <CustomTab style={{ fontWeight: 'bolder' }} label="NFT Collection" value={0} />
        </CustomTabs>

        <TabPanel index={0} value={tabValue}>
          <Hidden smUp>
            <Grid container justifyContent="flex-end">
              <AddressStatus status={syncStatus} loader={false} />
            </Grid>
          </Hidden>
          <Filter onChange={setFilter} />
          <div className={styles.nftsContainer}>
            {nfts.map((nft) => (
              <NFTItem key={nft._id} nft={nft} />
            ))}
          </div>
          {nfts.length ? (
            allLoaded ? (
              <></>
            ) : (
              <Button
                style={{ margin: '24px 0' }}
                variant="outlined"
                color="primary"
                onClick={() => loadMore()}
                disabled={loading || allLoaded}
              >
                Show More
              </Button>
            )
          ) : (
            <AddressStatus status={syncStatus} loader />
          )}
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default NftCollections;
