import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import metaverses from '../../constants/metaverses';
import { fetchMetaverseSummary } from '../../store/summary/metaverseSummary';
import { RootState } from '../../store/store';
import { fetchProfileOwnership, Asset } from 'store/summary/profileOwnershipSlice';
import { aggregateMetaverseSummaries } from './aggregateMetaverseSummaries';

const useProfileSummaries = (addresses: string[]) => {
  const dispatch = useDispatch();
  const profileOwnership = useSelector((state: RootState) => state.profileOwnership);

  const metaverseSummaries = useSelector((state: RootState) => state.metaverseSummary);

  const { isLoading } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    dispatch(fetchProfileOwnership(addresses));
    dispatch(fetchMetaverseSummary());
  }, []);

  const profileSummaries = useMemo(() => {
    const aggregatedOwnerships: Asset[][] = metaverses.map((_, metaverseIndex) => {
      const metaverseOwnership: Asset[] = [];
      profileOwnership.forEach((profile) => {
        metaverseOwnership.push(...profile.assets[metaverseIndex]);
      });
      return metaverseOwnership;
    });

    return aggregateMetaverseSummaries({
      metaverseSummaries,
      metaverseOwnerships: aggregatedOwnerships,
    });
  }, [metaverseSummaries, profileOwnership, isLoading]);

  return profileSummaries;
};

export default useProfileSummaries;
