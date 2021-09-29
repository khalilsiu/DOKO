import { Grid, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCollection, getNFTs } from './api';
import { NFTItem } from '../../components/NFTItem';
import CollectionHeader from './components/CollectionHeader';

const useStyles = makeStyles((theme) => ({
  collectionContainer: {
    padding: '64px 96px',
    marginTop: 36,
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
}));

export default function Collection() {
  const [collection, setCollection] = useState(null);
  const [, setLoading] = useState(false);
  const [nfts, setNFTs] = useState<any[]>([]);
  const [, setAllLoaded] = useState(false);
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();

  const fetchNfts = async (offset: number) => {
    if (!address) {
      return;
    }
    setLoading(true);

    try {
      const res = await getNFTs(address, offset, {});
      setNFTs((items) => [...items, ...res.data]);
      setAllLoaded(res.data.length < 12);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCollection(address).then(({ data }) => {
      setCollection(data);
    });

    fetchNfts(0);
  }, []);

  return (
    <div>
      <CollectionHeader collection={collection} />
      <div className={styles.collectionContainer}>
        <div className={styles.nftsContainer}>
          {nfts.map((nft) => (
            <NFTItem key={nft._id} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  );
}
