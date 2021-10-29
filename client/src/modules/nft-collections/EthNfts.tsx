/* eslint-disable no-console */
/* eslint-disable consistent-return */
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
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');

  const setFloorPrice = (assets: any, cols: any[]) =>
    assets.map((asset: any) => ({
      ...asset,
      floor_price: parseFloat(
        cols.find((c: any) => asset.collection.slug === c.value)?.floor_price || 0,
      ).toFixed(3),
    }));

  const fetchNfts = (pageNumber: number, cols: any[], selectedCol: string) => {
    setNfts([]);

    if (isSolAddress(address)) {
      return;
    }
    setLoading(true);
    setPage(pageNumber);
    getEthAssets(address, (pageNumber - 1) * 12, selectedCol).then((res) => {
      if (res.assets) {
        const assets = setFloorPrice(res.assets, cols || collections);
        setNfts(assets);
      }
      setLoading(false);
    });
  };

  const filterCollection = (v: any, cols?: any) => {
    setSelectedCollection(v);
    fetchNfts(1, cols || collections, v);
  };

  const fetchCollections = async () => {
    if (isSolAddress(address)) {
      setCollections([]);
      setNfts([]);
      setSelectedCollection('');
      setPage(0);
      return;
    }
    let options = [];

    try {
      const res = await getEthCollections(address);
      options = res
        .map((r) => ({
          value: r.slug,
          name: r.name,
          image: r.image_url,
          floor_price: r.stats.floor_price,
        }))
        .sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    } catch (err) {
      console.error(err);
    }
    setCollections(options);
    filterCollection('', options);
  };

  const filterSearch = () => (query: string) => {
    if (!query) {
      return [{ value: '', name: 'All' }, ...collections];
    }
    return collections.filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()));
  };

  useEffect(() => {
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
          onChange={(v) => filterCollection(v)}
          filterOptions={filterSearch}
        />
      </Grid>
      <NftPagination
        isOpenSea
        loading={loading}
        nfts={nfts}
        page={page}
        onNext={() => fetchNfts(page + 1, collections, selectedCollection)}
        onPrev={() => fetchNfts(page - 1, collections, selectedCollection)}
      />
    </div>
  );
}
