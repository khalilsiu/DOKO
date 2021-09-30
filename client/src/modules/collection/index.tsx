import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  MenuItem,
  MenuList,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dateFormat from 'dateformat';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import openseaApi from '../../libs/opensea-api';
import { getCollection, getNFTs } from './api';
import { NFTItem } from '../../components/NFTItem';
import CollectionHeader from './components/CollectionHeader';
import { ICollection } from './types';
import TweetField from './components/TweetField';
import { RadiusInput, Popover } from '../../components';

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

const sorts = [
  {
    name: 'name',
    order: 1,
    label: 'A to Z',
  },
  {
    name: 'name',
    order: -1,
    label: 'Z to A',
  },
];

export default function Collection() {
  const [collection, setCollection] = useState<ICollection>();
  const [loading, setLoading] = useState(false);
  const [nfts, setNFTs] = useState<any[]>([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState<any>({ term: '', sort: sorts[0] });
  const [params, setParams] = useState<any>({
    term: '',
    orderBy: 'name',
    direction: 1,
  });

  const applyFilter = (options?: any) => {
    const data = options || filter;
    setParams({
      term: data.term,
      orderBy: data.sort.name,
      direction: data.sort.order,
    });
  };

  const updateSort = (sort: any) => {
    setFilter((state: any) => ({
      ...state,
      sort,
    }));
    applyFilter({
      ...filter,
      sort,
    });
  };

  const fetchNfts = async (offset: number) => {
    if (!address) {
      return;
    }
    setLoading(true);

    try {
      const res = await getNFTs(address, offset, params);
      setNFTs((items) => [...items, ...res.data]);
      setAllLoaded(res.data.length < 12);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    Promise.all([
      openseaApi.get(`/asset_contract/${address}`).then(({ data }) => data),
      getCollection(address).then(({ data }) => data),
    ]).then(([d1, d2]) => {
      setCollection({ ...d1, ...d2 });
    });
  }, []);

  useEffect(() => {
    setNFTs([]);
    setAllLoaded(false);
    fetchNfts(0);
  }, [params]);

  const loadMore = () => {
    fetchNfts(nfts.length);
  };

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
                  {collection.collection.description && (
                    <Typography
                      style={{ color: 'white' }}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: collection.collection.description }}
                    />
                  )}
                  <Grid container spacing={4} style={{ marginTop: 24 }}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Items in Circulation</Typography>
                      <Typography variant="h5" style={{ fontWeight: 700 }}>
                        {collection.items || 0}
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
                      <Grid item>
                        <a href={collection.twitter_link}>
                          <IconButton>
                            <img
                              src="/collection/DOKOasset_TwitterWhiteCircle.png"
                              alt="src"
                              width={24}
                            />
                          </IconButton>
                        </a>
                      </Grid>
                      <Grid item>
                        <a href={collection.discord_link}>
                          <IconButton>
                            <img
                              src="/collection/DOKOasset_DiscrodWhiteCircle.png"
                              alt="src"
                              width={24}
                            />
                          </IconButton>
                        </a>
                      </Grid>
                      <Grid item>
                        <a href={`https://${collection.website_link}`}>
                          <IconButton>
                            <img src="/collection/DOKOasset_NewWindow.png" alt="src" width={24} />
                          </IconButton>
                        </a>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Typography variant="h5" gutterBottom style={{ fontWeight: 700, marginTop: 64 }}>
              Collection
            </Typography>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              style={{ paddingTop: 24, paddingBottom: 36 }}
            >
              <Grid item>
                <FormControl className={styles.searchInput}>
                  <RadiusInput
                    value={filter.term}
                    placeholder="Search your collection"
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    }
                    onChange={(e) => setFilter({ term: e.target.value })}
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <Popover
                  reference={
                    <Button className="gradient-button" variant="outlined" color="primary">
                      Sort By: {filter.sort.label}
                      {filter.sort.order === 1 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Button>
                  }
                  placement="bottom-end"
                >
                  <MenuList>
                    {sorts.map((sort) => (
                      <MenuItem
                        className={sort.label === filter.sort.label ? 'selected' : ''}
                        key={sort.label}
                        style={{ minWidth: 180 }}
                        onClick={() => updateSort(sort)}
                      >
                        {sort.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Popover>
              </Grid>
            </Grid>
            <div className={styles.nftsContainer}>
              {nfts.map((nft) => (
                <NFTItem key={nft._id} nft={nft} />
              ))}
            </div>
            {loading ? (
              <CircularProgress />
            ) : nfts.length ? (
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
              <Typography>No Items</Typography>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
