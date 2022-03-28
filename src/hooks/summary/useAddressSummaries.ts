import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressOwnership } from 'store/address/addressOwnershipSlice';
import { fetchMetaverseSummary } from 'store/summary/metaverseSummary';

import { RootState } from '../../store/store';
import { AggregatedSummary, aggregateSummaries } from './aggregateSummaries';

const useAddressSummaries = (walletAddress: string) => {
  const [addressSummaries, setAddressSummaries] = useState<AggregatedSummary[]>([]);
  const dispatch = useDispatch();

  const addressOwnership = useSelector((state: RootState) => state.addressOwnership);

  const metaverseSummaries = useSelector((state: RootState) => state.metaverseSummary);

  useEffect(() => {
    if (walletAddress) {
      dispatch(fetchAddressOwnership(walletAddress));
      dispatch(fetchAddressOwnership(walletAddress));
      dispatch(fetchMetaverseSummary());
    }
  }, [walletAddress]);

  useEffect(() => {
    setAddressSummaries(
      aggregateSummaries({
        metaverseSummaries,
        metaverseAssets: addressOwnership.assets,
        metaverseLeasedAssets: addressOwnership.leasedAssets,
        metaverseRentedAssets: addressOwnership.rentedAssets,
      }),
    );
  }, [metaverseSummaries, addressOwnership]);

  return addressSummaries;
};

export default useAddressSummaries;
