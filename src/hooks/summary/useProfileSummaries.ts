import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetaverseSummary } from '../../store/summary/metaverseSummary';
import { RootState } from '../../store/store';
import { fetchProfileOwnership, Asset } from 'store/profile/profileOwnershipSlice';
import { aggregateSummaries } from './aggregateSummaries';

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
    const profileAssets: Asset[][] = [];
    const profileLeasedAssets: Asset[][] = [];
    const profileRentedAssets: Asset[][] = [];

    profileOwnership.forEach((addressOwnership) => {
      profileAssets.push(...addressOwnership.assets);
      profileLeasedAssets.push(...addressOwnership.leasedAssets);
      profileRentedAssets.push(...addressOwnership.rentedAssets);
    });

    return aggregateSummaries({
      metaverseSummaries,
      metaverseAssets: profileAssets,
      metaverseLeasedAssets: profileLeasedAssets,
      metaverseRentedAssets: profileRentedAssets,
    });
  }, [metaverseSummaries, profileOwnership, isLoading]);

  return profileSummaries;
};

export default useProfileSummaries;
