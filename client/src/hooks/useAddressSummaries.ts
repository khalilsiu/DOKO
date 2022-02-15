import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { AggregatedSummary, getAggregatedSummary } from './useProfileSummaries';

const useAddressSummaries = () => {
  const [addressSummaries, setAddressSummaries] = useState<AggregatedSummary[]>([]);

  const addressOwnership = useSelector((state: RootState) => state.addressOwnership);

  const collectionSummaries = useSelector((state: RootState) => state.collectionSummary);

  const { isLoading } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    setAddressSummaries(
      getAggregatedSummary(collectionSummaries, addressOwnership.assets, isLoading),
    );
  }, [collectionSummaries, addressOwnership, isLoading]);

  return addressSummaries;
};

export default useAddressSummaries;
