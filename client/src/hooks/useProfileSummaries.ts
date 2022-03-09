import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import metaverses from '../constants/metaverses';
import { fetchCollectionSummary, MetaverseSummary } from '../store/summary/collectionSummarySlice';

import { RootState } from '../store/store';
import { Lease } from '../store/lease/metaverseLeasesSlice';
import { Trait, fetchProfileOwnership, Asset } from 'store/summary/profileOwnershipSlice';

export interface Filter {
  traitType: string;
  value: any;
  operator: string;
}

function match(filters: Filter[], trait: Trait) {
  if (!filters.length) {
    return false;
  }
  return filters.every((filter) => {
    if (filter.traitType !== trait.traitType) {
      return false;
    }
    if (filter.operator === '=' && filter.value !== trait.value) {
      return false;
    }
    if (filter.operator === '>=' && !(filter.value >= trait.value)) {
      return false;
    }
    if (filter.operator === '<=' && !(filter.value <= trait.value)) {
      return false;
    }
    return true;
  });
}

export interface AggregatedSummary {
  name: string;
  icon: string;
  count: number;
  price: number;
  available: boolean;
  loading: boolean;
  ownership: Asset[];
}

interface IGetAggregatedSummary {
  collectionSummaries: MetaverseSummary[];
  ownerships: Asset[][];
  leases?: Lease[][][];
  isLoading: boolean;
}
export function getAggregatedSummary({
  collectionSummaries,
  ownerships,
  leases,
  isLoading,
}: IGetAggregatedSummary) {
  return metaverses.map((metaverse, metaverseIndex) => {
    const metaverseLeases = leases ? leases[metaverseIndex] : [];
    const addressAssetIdToLeaseMap = metaverseLeases.flat().reduce(
      (acc, lease) => ({
        ...acc,
        [`${lease.contractAddress}_${lease.tokenId}`]: lease,
      }),
      {},
    );
    // get traits with floor price from collection summaries
    const traitsWithFloorPrice = metaverse.traits.map((filters, traitIndex) => ({
      filters,
      floorPrice: collectionSummaries[metaverseIndex].traits[traitIndex],
    }));

    const assetsWithFloorPrice = ownerships[metaverseIndex].map((asset) => {
      // floor price be collection floor price then match price with filter
      let { floorPrice } = traitsWithFloorPrice[0];

      asset.traits.forEach((trait) => {
        traitsWithFloorPrice.forEach((traitFilter) => {
          if (!match(traitFilter.filters, trait)) {
            return;
          }
          floorPrice = traitFilter.floorPrice;
        });
      });
      // special case for decentraland estate
      if (asset.assetContract.address === '0x959e104e1a4db6317fa58f8295f586e1a978c297') {
        const sizeTrait = asset.traits.find((trait) => trait.traitType === 'Size');
        const size = parseInt((sizeTrait && sizeTrait.value) || '1', 10);
        floorPrice *= size;
      }

      const key = `${asset.assetContract.address}_${asset.tokenId}`;
      let lease: Lease | undefined = undefined;
      if (addressAssetIdToLeaseMap && addressAssetIdToLeaseMap[key]) {
        lease = addressAssetIdToLeaseMap[key];
      }

      return {
        ...asset,
        lease,
        floorPrice,
      };
    });

    return {
      name: metaverse.label,
      icon: metaverse.icon,
      count: assetsWithFloorPrice.length,

      price: assetsWithFloorPrice.reduce((floorPrice, asset) => asset.floorPrice + floorPrice, 0),
      available: true,
      loading: isLoading,
      ownership: assetsWithFloorPrice,
    };
  });
}

const useProfileSummaries = (addresses: string[]) => {
  const dispatch = useDispatch();
  const profileOwnership = useSelector((state: RootState) => state.profileOwnership);

  const collectionSummaries = useSelector((state: RootState) => state.collectionSummary);

  const { isLoading } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    dispatch(fetchProfileOwnership(addresses));
    dispatch(fetchCollectionSummary());
  }, []);

  const profileSummaries = useMemo(() => {
    const aggregatedOwnerships: Asset[][] = metaverses.map((_, metaverseIndex) => {
      const metaverseOwnership: Asset[] = [];
      profileOwnership.forEach((profile) => {
        metaverseOwnership.push(...profile.assets[metaverseIndex]);
      });
      return metaverseOwnership;
    });

    return getAggregatedSummary({
      collectionSummaries,
      ownerships: aggregatedOwnerships,
      isLoading,
    });
  }, [collectionSummaries, profileOwnership, isLoading]);

  return profileSummaries;
};

export default useProfileSummaries;
