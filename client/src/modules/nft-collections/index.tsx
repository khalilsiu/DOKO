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
import { getNFTs } from '../api';
import { TabPanel } from '../../components/TabPanel';
import { Filter } from './Filter';
import { Intro } from '../core/Intro';
import { minimizeAddress } from '../../libs/utils';

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
        <Grid>
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
        <CustomTabs
          indicatorColor="primary"
          textColor="primary"
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
        >
          <CustomTab style={{ fontWeight: 'bolder' }} label="NFT Collection" value={0} />
        </CustomTabs>

        <TabPanel index={0} value={tabValue}>
          <Filter onChange={setFilter} />
          <Grid container wrap="wrap" alignItems="stretch" spacing={2}>
            {nfts.map(nft => (
              <Grid item key={`${nft.token_address}-${nft.token_id}`} lg={3} md={4} sm={6} xs={12}>
                <NFTItem nft={nft} />
              </Grid>
            ))}
          </Grid>
          {nfts.length ? (
            allLoaded ? (
              <></>
            ) : (
              <Button
                style={{ margin: '24px 0' }}
                variant="outlined"
                color="primary"
                onClick={() => setIndex(index + 9)}
                disabled={loading || allLoaded}
              >
                Show More
              </Button>
            )
          ) : (
            <Typography variant="h6">No Items</Typography>
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
    position: 'relative'
  },
  itemsContainer: {
    paddingLeft: 36,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0
    }
  }
}));
