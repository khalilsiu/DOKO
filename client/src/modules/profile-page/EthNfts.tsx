/* eslint-disable implicit-arrow-linebreak */
import { useEffect, useState } from 'react';
import SelectSearch from 'react-select-search';
import { Grid } from '@material-ui/core';

import { NftPagination } from '../../components';
import SectionLabel from '../../components/SectionLabel';
import { getEthAssets, getEthCollections } from './api';
import { isSolAddress } from '../../libs/utils';

import './select-search.css';

interface Props {
  data: any;
}

export default function EthNfts({ data }: Props) {
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(1);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');

  const filterCollection = (v: any) => {
    setSelectedCollection(v);
  };

  const filterSearch = () => (query: string) => {
    if (!query) {
      return [{ value: '', name: 'All' }, ...collections];
    }
    return collections.filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()));
  };

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
        loading={data.loading}
        nfts={data.nfts.slice((page - 1) * 12, (page) * 12)}
        page={page}
        maxPage={data.nfts.length / 12 + 1}
        onNext={() => setPage(page + 1)}
        onPrev={() => setPage(page - 1)}
      />
    </div>
  );
}
