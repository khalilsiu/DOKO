import { useEffect, useState } from 'react';
import { Button, Card, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';

import { NFTItem } from './NFTItem';
import { getNFTs } from '../api';
import { useSelector } from 'react-redux';
import { State } from '../../store';
import { TabPanel } from '../../components/TabPanel';
import { Filter } from './Filter';

export const NftCollections = () => {
  const [loading, setLoading] = useState(false);
  const [nfts, setNFTs] = useState<any[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const address = useSelector<State, string>(state => state.auth.user.address as string);
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchNfts = async () => {
    if (!address || index < 0) {
      return;
    }

    try {
      const res = await getNFTs(address, index);
      setNFTs(nfts => [...nfts, ...res.data]);
      setAllLoaded(res.data.length < 12);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    setNFTs([]);
    setIndex(address ? 0 : -1);
    setAllLoaded(false);
  }, [address]);

  useEffect(() => {
    setLoading(true);
    fetchNfts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <Grid container wrap="nowrap" className={styles.collectionContainer}>
      <Grid item md={4}>
        <Card style={{ height: 600, margin: '0 24px' }}></Card>
      </Grid>
      <Grid container direction="column" alignItems="flex-start" style={{ padding: 24 }}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
        >
          <Tab style={{ fontWeight: 'bolder' }} label="NFT Collection" value={0} />
        </Tabs>

        <TabPanel index={0} value={tabValue}>
          <Filter />
          <Grid container wrap="wrap" alignItems="stretch" spacing={2}>
            {nfts.map(nft => (
              <Grid item key={`${nft.token_address}-${nft.token_id}`} lg={3} md={4} xs={6}>
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
          ) : address ? (
            <Typography>No Items</Typography>
          ) : (
            <Typography>Please sign in first</Typography>
          )}
        </TabPanel>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  collectionContainer: {
    marginTop: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  }
}));
