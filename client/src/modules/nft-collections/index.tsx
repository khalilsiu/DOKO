import { useEffect, useState } from 'react';
import {
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

import { TabPanel, NftPagination, Meta } from '../../components';
import { getAddressStatus, getNFTs, indexAddress } from '../api';
import { Filter } from './Filter';
import Intro from '../core/Intro';
import { minimizeAddress } from '../../libs/utils';
import { AddressStatus } from './AddressStatus';
import CopyAddress from '../../components/CopyAddress';
import EthNfts from './EthNfts';
import SectionLabel from '../../components/SectionLabel';
import { Summary } from './Summary';

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
  const [filter, setFilter] = useState<any>({});
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [page, setPage] = useState(0);

  const fetchNfts = async () => {
    setNFTs([]);

    if (!address) {
      return;
    }
    setLoading(true);

    try {
      const res = await getNFTs(address, (page - 1) * 12, filter);
      const items = res.data;
      setNFTs(items);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setNFTs([]);
    }
    setLoading(false);
  };

  const checkSyncStatus = async () => {
    try {
      const res = await getAddressStatus(address);
      const sync = res.data;

      if (sync?.sync_status === 'done' || sync?.sync_status === 'empty') {
        clearInterval(syncInterval);

        if (Date.now() / 1000 - sync.timestamp < 5000 && sync.sync_status === 'done') {
          setPage(1);
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
    if (page === 1) {
      fetchNfts();
    } else {
      setPage(1);
    }
  }, [address, filter]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    page && fetchNfts();
  }, [page]);

  const reIndex = () => {
    indexAddress(address, true);
    setSyncStatus(null);
    setNFTs([]);
    clearInterval(syncInterval);
    syncInterval = setInterval(() => checkSyncStatus(), 3000);
  };

  return (
    <>
      <Meta
        title={`${address} - Profile | DOKO`}
        description="The Multi-Chain NFT Portfolio Manager that allows you to display, manage & trade your NFTs"
        url="https://doko.one"
        image="/DOKO_LOGO.png"
      />
      <Grid container wrap="nowrap" className={styles.collectionContainer}>
        <Hidden smDown>
          <Grid item>
            <Card className={styles.introCard}>
              <Intro drawer={false} />
            </Card>
          </Grid>
        </Hidden>
        <Grid
          className={styles.itemsContainer}
          container
          direction="column"
          alignItems="flex-start"
        >
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
              <CopyAddress address={address} />
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

            <Summary address={address} />

            <EthNfts address={address} />

            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              BSC & Polygon NFTs (Beta)
            </SectionLabel>
            <Filter onChange={setFilter} />
            <NftPagination
              nfts={nfts}
              page={page}
              onNext={() => setPage(page + 1)}
              onPrev={() => setPage(page - 1)}
              loading={loading}
            />
            {/* {nfts.length ? (
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
            )} */}
          </TabPanel>
        </Grid>
      </Grid>
    </>
  );
};

export default NftCollections;
