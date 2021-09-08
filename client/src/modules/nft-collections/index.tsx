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
  withStyles
} from '@material-ui/core';
import { useParams } from 'react-router-dom';

import { NFTItem } from './NFTItem';
import { getAddressStatus, getNFTs, indexAddress } from '../api';
import { TabPanel } from '../../components/TabPanel';
import { Filter } from './Filter';
import { Intro } from '../core/Intro';
import { minimizeAddress } from '../../libs/utils';
import { AddressStatus } from './AddressStatus';

const CustomTabs = withStyles({
  root: {
    width: '100%'
  },
  flexContainer: {
    borderBottom: '2px solid #46324a'
  }
})(Tabs);

const CustomTab = withStyles({
  wrapper: {
    textTransform: 'none'
  }
})(Tab);

let syncInterval: any;

export const NftCollections = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [nfts, setNFTs] = useState<any[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [filter, setFilter] = useState<any>({});
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  const fetchNfts = async () => {
    if (!address || index < 0) {
      return;
    }

    try {
      const res = await getNFTs(address, index, filter);
      setNFTs(nfts => [...nfts, ...res.data]);
      setAllLoaded(res.data.length < 12);
    } catch (err) {}
    setLoading(false);
  };

  const checkSyncStatus = async () => {
    try {
      const res = await getAddressStatus(address);
      const sync = res.data;
      setSyncStatus(sync || {});

      if (sync?.sync_status === 'done' || sync?.sync_status === 'empty') {
        clearInterval(syncInterval);
        setIndex(nfts.length);
      }
    } catch (err) {
      syncStatus || setSyncStatus({});
    }
  };

  useEffect(() => {
    clearInterval(syncInterval);
    return () => clearInterval(syncInterval);
  }, []);

  useEffect(() => {
    if (!address) {
      return;
    }
    indexAddress(address);
    clearInterval(syncInterval);

    syncInterval = setInterval(() => checkSyncStatus(), 5000);
    checkSyncStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    setNFTs([]);

    if (index === 0) {
      fetchNfts();
    }
    setIndex(address ? 0 : -1);
    setAllLoaded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, filter]);

  useEffect(() => {
    setLoading(true);
    fetchNfts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const copy = () => {
    if (copied) {
      return;
    }
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Grid container wrap="nowrap" className={styles.collectionContainer}>
      {
        <Hidden smDown>
          <Grid item>
            <Card className={styles.introCard}>
              <Intro />
            </Card>
          </Grid>
        </Hidden>
      }
      <Grid className={styles.itemsContainer} container direction="column" alignItems="flex-start">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
              {minimizeAddress(address)}
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
            {nfts.map(nft => (
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
                onClick={() => setIndex(nfts.length)}
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

const useStyles = makeStyles(theme => ({
  collectionContainer: {
    padding: 24,
    marginTop: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    minHeight: 'calc(100vh)'
  },
  introCard: {
    position: 'sticky',
    top: 120
  },
  itemsContainer: {
    paddingLeft: 36,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0
    }
  },
  nftsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: '1fr',
    columnGap: 12,
    rowGap: 12,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)'
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)'
    }
  }
}));
