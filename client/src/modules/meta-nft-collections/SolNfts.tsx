import { useEffect, useState } from 'react';
import { NftPagination } from '../../components';
import SectionLabel from '../../components/SectionLabel';
import { getSolNfts } from '../../libs/solana';
import { isSolAddress } from '../../libs/utils';

interface Props {
  data: any;
}

export default function SolNfts({ data }: Props) {
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(1);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNfts(data.nfts);
    setCollections(data.collections);
  }, [data]);

  return (
    <div style={{ marginTop: 36 }}>
      <SectionLabel variant="h5" style={{ marginBottom: 36 }}>
        Solana NFTs
      </SectionLabel>
      <NftPagination
        isSolana
        loading={data.loading}
        nfts={nfts.slice((page - 1) * 12, page * 12)}
        page={page}
        maxPage={Math.floor(nfts.length / 12) + 1}
        onNext={() => setPage(page + 1)}
        onPrev={() => setPage(page - 1)}
      />
    </div>
  );
}
