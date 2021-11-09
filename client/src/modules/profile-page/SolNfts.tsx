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
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

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
