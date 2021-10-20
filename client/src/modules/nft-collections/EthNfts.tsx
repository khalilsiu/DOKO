import { useEffect, useState } from 'react';
import { NftPagination } from '../../components';
import SectionLabel from '../../components/SectionLabel';
import { getEthAssets } from './api';
import { isSolAddress } from '../../libs/utils';

interface Props {
  address: string;
}

export default function EthNfts({ address }: Props) {
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNfts = () => {
    if (isSolAddress(address)) {
      return;
    }
    setLoading(true);
    setNfts([]);
    getEthAssets(address, (page - 1) * 12).then((res) => {
      if (res.assets) {
        setNfts(res.assets);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    page && fetchNfts();
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      fetchNfts();
    } else {
      setPage(1);
    }
  }, [address]);

  return (
    <div>
      <SectionLabel variant="h5" style={{ marginBottom: 36 }}>
        Ethereum NFTs
      </SectionLabel>
      <NftPagination
        isOpenSea
        loading={loading}
        nfts={nfts}
        page={page}
        onNext={() => setPage(page + 1)}
        onPrev={() => setPage(page - 1)}
      />
    </div>
  );
}
