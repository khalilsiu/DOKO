/* eslint-disable implicit-arrow-linebreak */
import { useEffect, useState } from 'react';
import SelectSearch from 'react-select-search';
import { Grid } from '@material-ui/core';

import { NftPagination } from '../../components';
import SectionLabel from '../../components/SectionLabel';
import { getEthAssets, getEthCollections } from './api';
import { isSolAddress } from '../../libs/utils';

interface Props {
  address: string;
}

export default function EthNfts({ address }: Props) {
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');

  const setFloorPrice = (assets: any, cols: any) =>
    assets.map((asset: any) => ({
      ...asset,
      floor_price: parseFloat(
        (cols as any).find((c: any) => asset.collection.slug === c.value)?.floor_price || 0,
      ).toFixed(3),
    }));

  const fetchNfts = (pageNumber: number) => {
    setNfts([]);

    if (isSolAddress(address)) {
      return;
    }
    setLoading(true);
    setPage(pageNumber);
    getEthAssets(address, (pageNumber - 1) * 12, selectedCollection).then((res) => {
      if (res.assets) {
        const assets = setFloorPrice(res.assets, collections);
        setNfts(assets);
      }
      setLoading(false);
    });
  };

  const fetchCollections = () => {
    if (isSolAddress(address)) {
      setCollections([]);
      return;
    }
    getEthCollections(address)
      .then((res) => {
        const options = res
          .map((r: any) => ({
            value: r.slug,
            name: r.name,
            image: r.image_url,
            floor_price: r.stats.floor_price,
          }))
          .sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

        setCollections(options);

        if (nfts?.length) {
          setNfts(setFloorPrice(nfts, options));
        }
      })
      .catch(() => {
        setCollections([]);
      });
  };

  const filterCollection = (v: any) => {
    setSelectedCollection(v);
  };

  const filterSearch = () => (query: string) => {
    if (!query) {
      return [{ value: '', name: 'All' }, ...collections];
    }
    return collections.filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()));
  };

  useEffect(() => {
    fetchNfts(1);
  }, [selectedCollection]);

  useEffect(() => {
    setSelectedCollection('');
    fetchCollections();
  }, [address]);

  return (
    <div>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: 36 }}
      >
        <SectionLabel variant="h5">Ethereum NFTs</SectionLabel>
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
        isOpenSea
        loading={loading}
        nfts={nfts}
        page={page}
        onNext={() => fetchNfts(page + 1)}
        onPrev={() => fetchNfts(page - 1)}
      />
    </div>
  );
}
