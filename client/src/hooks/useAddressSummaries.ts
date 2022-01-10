import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getAggregatedSummary } from './useProfileSummaries';

const useAddressSummaries = () => {
  const addressOwnership = useSelector((state: RootState) => state.addressOwnership);

  const collectionSummaries = useSelector((state: RootState) => state.collectionSummary);

  const { isLoading } = useSelector((state: RootState) => state.appState);

  const metaverseSummaries = useMemo(
    () => getAggregatedSummary(collectionSummaries, addressOwnership.assets, isLoading),
    [collectionSummaries, addressOwnership, isLoading],
  );

  return metaverseSummaries;
};

export default useAddressSummaries;
