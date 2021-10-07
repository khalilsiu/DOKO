import {
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dateFormat from 'dateformat';

import { getEthNFTs, getCollectionDetail } from './api';
import CollectionHeader from './components/CollectionHeader';
import TweetField from './components/TweetField';
import { NftPagination } from '../../components';
import NftData from './components/NftData';

const useStyles = makeStyles((theme) => ({
  collectionContainer: {
    padding: '24px 96px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    minHeight: 'calc(100vh)',
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
  socialCollectionDetailContainer: {
    border: '1px solid white',
    borderRadius: 14,
  },
  socialCollectionDetailTier: {
    padding: '24px 36px',
  },
  tabContainer: {},
  searchInput: {
    width: 300,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

export default function Collection() {
  const [collection, setCollection] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [nfts, setNFTs] = useState<any[]>([]);
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);

  const fetchNfts = async () => {
    setNFTs([]);

    if (!address) {
      return;
    }
    setLoading(true);

    try {
      const {
        data: { assets },
      } = await getEthNFTs(address, (page - 1) * 12);
      setNFTs(assets);

      if (page === 1) {
        const res = await getCollectionDetail(address, assets[0].token_id);
        setCollection(res);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setNFTs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (page === 1) {
      fetchNfts();
    } else {
      setPage(1);
    }
  }, [address]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    page && fetchNfts();
  }, [page]);

  return (
    <div>
      {collection ? (
        <CollectionHeader tab={tab} setTab={setTab} collection={collection} />
      ) : (
        <div className={styles.collectionContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={styles.collectionContainer}>
        {tab === 0 && (
          <div className={styles.tabContainer}>
            {collection && (
              <Grid container wrap="nowrap" spacing={3}>
                <Grid item xs={8}>
                  <Typography variant="h5" gutterBottom style={{ fontWeight: 700 }}>
                    Description
                  </Typography>
                  {collection.description && (
                    <Typography
                      style={{ color: 'white' }}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: collection.description }}
                    />
                  )}
                  <Grid container spacing={4} style={{ marginTop: 24 }}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Items in Circulation</Typography>
                      <Typography variant="h5" style={{ fontWeight: 700 }}>
                        {collection.stats.total_supply || 0}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle2">Contract Deployment</Typography>
                      <Typography variant="h5" style={{ fontWeight: 700 }}>
                        {dateFormat(collection.created_date, 'yy/mm/dd')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid className={styles.socialCollectionDetailContainer}>
                    <Grid
                      container
                      className={styles.socialCollectionDetailTier}
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <TweetField title="Followers" value={156} />
                      </Grid>
                      <Grid item>
                        <TweetField title="Mentions(last 24h)" value={132} />
                      </Grid>
                      <Grid item>
                        <TweetField title="Re-tweets" value={184} />
                      </Grid>
                    </Grid>
                    <Divider style={{ backgroundColor: 'white' }} />
                    <Grid container className={styles.socialCollectionDetailTier} spacing={2}>
                      {collection.twitter_username && (
                        <Grid item>
                          <a
                            href={`https://twitter.com/${collection.twitter_username}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <IconButton>
                              <img
                                src="/collection/DOKOasset_TwitterWhiteCircle.png"
                                alt="src"
                                width={24}
                              />
                            </IconButton>
                          </a>
                        </Grid>
                      )}
                      {collection.discord_url && (
                        <Grid item>
                          <a href={collection.discord_url} target="_blank" rel="noreferrer">
                            <IconButton>
                              <img
                                src="/collection/DOKOasset_DiscrodWhiteCircle.png"
                                alt="src"
                                width={24}
                              />
                            </IconButton>
                          </a>
                        </Grid>
                      )}
                      {collection.external_url && (
                        <Grid item>
                          <a href={collection.external_url} target="_blank" rel="noreferrer">
                            <IconButton>
                              <img src="/collection/DOKOasset_NewWindow.png" alt="src" width={24} />
                            </IconButton>
                          </a>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Typography variant="h5" gutterBottom style={{ fontWeight: 700, marginTop: 64 }}>
              Collection
            </Typography>
            {loading && <CircularProgress />}
            <NftPagination
              isOpenSea
              nfts={nfts}
              page={page}
              onNext={() => setPage(page + 1)}
              onPrev={() => setPage(page - 1)}
              loading={loading}
            />
          </div>
        )}
        {tab === 1 && <NftData collection={collection} />}
      </div>
    </div>
  );
}
