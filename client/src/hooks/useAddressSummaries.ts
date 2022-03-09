import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressOwnership } from 'store/summary/addressOwnershipSlice';
import { fetchCollectionSummary } from 'store/summary/collectionSummarySlice';
import { getMetaverseLeases } from '../store/lease/metaverseLeasesSlice';
import { RootState } from '../store/store';
import { AggregatedSummary, getAggregatedSummary } from './useProfileSummaries';

const useAddressSummaries = (walletAddress: string) => {
  const [addressSummaries, setAddressSummaries] = useState<AggregatedSummary[]>([]);
  const dispatch = useDispatch();

  const addressOwnership = useSelector((state: RootState) => state.addressOwnership);

  const collectionSummaries = useSelector((state: RootState) => state.collectionSummary);

  const metaverseLeases = useSelector((state: RootState) => state.metaverseLeases);

  const { isLoading } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (walletAddress) {
      dispatch(fetchAddressOwnership(walletAddress));
      dispatch(getMetaverseLeases({ lessor: walletAddress }));
      dispatch(fetchCollectionSummary());
    }
  }, [walletAddress]);

  useEffect(() => {
    setAddressSummaries(
      getAggregatedSummary({
        collectionSummaries,
        ownerships: addressOwnership.assets,
        leases: metaverseLeases,
        isLoading,
      }),
    );
  }, [collectionSummaries, addressOwnership, isLoading, metaverseLeases]);

  return addressSummaries;
};

export default useAddressSummaries;
