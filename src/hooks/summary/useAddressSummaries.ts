import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressOwnership } from 'store/summary/addressOwnershipSlice';
import { fetchMetaverseSummary } from 'store/summary/metaverseSummary';
import { getMetaverseLeases } from '../../store/lease/metaverseLeasesSlice';
import { RootState } from '../../store/store';
import { AggregatedSummary, aggregateMetaverseSummaries } from './aggregateMetaverseSummaries';

const useAddressSummaries = (walletAddress: string) => {
  const [addressSummaries, setAddressSummaries] = useState<AggregatedSummary[]>([]);
  const dispatch = useDispatch();

  const addressOwnership = useSelector((state: RootState) => state.addressOwnership);

  const metaverseSummaries = useSelector((state: RootState) => state.metaverseSummary);

  const metaverseLeases = useSelector((state: RootState) => state.metaverseLeases);

  useEffect(() => {
    if (walletAddress) {
      dispatch(fetchAddressOwnership(walletAddress));
      dispatch(getMetaverseLeases({ lessor: walletAddress }));
      dispatch(fetchMetaverseSummary());
    }
  }, [walletAddress]);

  useEffect(() => {
    setAddressSummaries(
      aggregateMetaverseSummaries({
        metaverseSummaries,
        metaverseOwnerships: addressOwnership.assets,
        metaverseLeases,
      }),
    );
  }, [metaverseSummaries, addressOwnership, metaverseLeases]);

  return addressSummaries;
};

export default useAddressSummaries;
