import { useEffect, useState } from 'react';
import { NftPagination } from '../../components';
import SectionLabel from '../../components/SectionLabel';
import { getSolNfts } from '../../libs/solana';

interface Props {
  address: string;
}

export default function SolNfts({ address }: Props) {
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNfts = () => {
    setLoading(true);
    setNfts([]);
    getSolNfts(address, (page - 1) * 12).then((res) => {
      if (res) {
        setNfts(res.data as any);
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
    <div style={{ marginTop: 36 }}>
      <SectionLabel variant="h5" style={{ marginBottom: 36 }}>
        Solana NFTs
      </SectionLabel>
      <NftPagination
        isSolana
        loading={loading}
        nfts={nfts}
        page={page}
        onNext={() => setPage(page + 1)}
        onPrev={() => setPage(page - 1)}
      />
    </div>
  );
}
