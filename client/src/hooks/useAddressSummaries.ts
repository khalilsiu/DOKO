import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeases } from '../store/lease/leasesSlice';
import { fetchAddressOwnership, fetchCollectionSummary } from '../store/summary';
import { RootState } from '../store/store';
import { AggregatedSummary, getAggregatedSummary } from './useProfileSummaries';

const useAddressSummaries = (walletAddress: string) => {
  const [addressSummaries, setAddressSummaries] = useState<AggregatedSummary[]>([]);
  const dispatch = useDispatch();

  const addressOwnership = useSelector((state: RootState) => state.addressOwnership);

  const collectionSummaries = useSelector((state: RootState) => state.collectionSummary);

  const leases = useSelector((state: RootState) => state.leases);

  const { isLoading } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    dispatch(fetchAddressOwnership(walletAddress));
    dispatch(getLeases({ lessor: walletAddress }));
    dispatch(fetchCollectionSummary());
  }, []);

  useEffect(() => {
    setAddressSummaries(
      getAggregatedSummary({
        collectionSummaries,
        ownerships: addressOwnership.assets,
        leases,
        isLoading,
      }),
    );
  }, [collectionSummaries, addressOwnership, isLoading, leases]);

  return addressSummaries;
};

export default useAddressSummaries;
