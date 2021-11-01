/* eslint-disable indent */
/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';
import SelectSearch from 'react-select-search';

import { NftPagination } from '../../components';
import SectionLabel from '../../components/SectionLabel';
import { getSolNfts } from '../../libs/solana';
import { isSolAddress } from '../../libs/utils';

interface Props {
  address: string;
}

export default function SolNfts({ address }: Props) {
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<any>([]);
  const [selectedCollection, setSelectedCollection] = useState('');

  const fetchNfts = () => {
    setNfts([]);

    if (!isSolAddress(address)) {
      return;
    }
    setLoading(true);

    getSolNfts(address).then((res) => {
      if (res) {
        setNfts(res.data as any);
        const cols = Object.values(
          res.data.reduce(
            (a: any, b: any) => ({
              ...a,
              ...(b.metadata?.collection?.name
                ? {
                    [b.metadata.collection.name]: {
                      ...b.metadata.collection,
                      value: b.metadata.collection.name,
                    },
                  }
                : {}),
            }),
            {},
          ),
        );
        setCollections(cols);
      }
      setLoading(false);
    });
  };

  const filterSearch = () => (query: string) => {
    if (!query) {
      return [{ value: '', name: 'All' }, ...collections];
    }
    return collections.filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()));
  };

  const filterCollection = (v: any) => {
    setPage(1);
    setSelectedCollection(v);
  };

  useEffect(() => {
    fetchNfts();
    filterCollection('');
  }, [address]);

  return (
    <div style={{ marginTop: 36 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: 36 }}
      >
        <SectionLabel variant="h5">Solana NFTs</SectionLabel>
        <SelectSearch
          placeholder="Select a collection"
          closeOnSelect
          search
          options={[{ value: '', name: 'All' }, ...collections]}
          value={selectedCollection}
          onChange={filterCollection}
          filterOptions={filterSearch}
        />
      </Grid>
      <NftPagination
        isSolana
        loading={loading}
        nfts={nfts
          .filter((nft: any) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            selectedCollection ? nft.metadata?.collection?.name === selectedCollection : true,
          )
          .slice((page - 1) * 12, page * 12)}
        page={page}
        onNext={() => setPage(page + 1)}
        onPrev={() => setPage(page - 1)}
      />
    </div>
  );
}
