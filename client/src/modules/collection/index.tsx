import { CircularProgress, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getEthNFTs, getCollectionDetail } from './api';
import { getSolNfts } from '../../libs/solana';

import { isSolAddress } from '../../libs/utils';
import CollectionHeader from './components/CollectionHeader';
// import TweetField from './components/TweetField';
import { Meta } from '../../components';
import NftData from './components/NftData';
import CollectionTab from './components/CollectionTab';

const useStyles = makeStyles((theme) => ({
  collectionContainer: {
    padding: '24px 96px',
    [theme.breakpoints.down('sm')]: {
      padding: 24,
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
      } = await (isSolAddress(address)
        ? getSolNfts(address, (page - 1) * 12)
        : getEthNFTs(address, (page - 1) * 12));

      let c = collection;

      if (page === 1 && !isSolAddress(address)) {
        const res = await getCollectionDetail(address, assets[0].token_id);
        setCollection({ ...res, contractAddress: address });
        c = res;
      }
      setNFTs(
        assets.map((asset) => ({
          ...asset,
          floor_price: parseFloat(c.stats.floor_price || 0).toFixed(2),
        })),
      );
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
      {collection && (
        <Meta
          title={`${collection.name} | DOKO`}
          description={collection.description}
          image={collection.large_image_url}
          url="https://doko.one"
        />
      )}
      {collection ? (
        <CollectionHeader tab={tab} setTab={setTab} collection={collection} />
      ) : (
        <div className={styles.collectionContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={styles.collectionContainer}>
        {tab === 0 && (
          <CollectionTab
            setPage={setPage}
            nfts={nfts}
            loading={loading}
            page={page}
            collection={collection}
          />
        )}
        {tab === 1 && <NftData collection={collection} />}
      </div>
    </div>
  );
}
