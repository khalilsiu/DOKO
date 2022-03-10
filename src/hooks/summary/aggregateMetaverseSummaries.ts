import { MetaverseSummary } from '../../store/summary/metaverseSummary';
import { Lease } from '../../store/lease/metaverseLeasesSlice';
import { keyBy } from 'lodash';
import { Asset, Trait } from '../../store/summary/profileOwnershipSlice';
import metaverses from '../../constants/metaverses';
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
  ownership: Asset[];
}

interface IGetAggregatedSummary {
  metaverseSummaries: MetaverseSummary[];
  metaverseOwnerships: Asset[][];
  metaverseLeases?: Lease[][][];
}
export function aggregateMetaverseSummaries({
  metaverseSummaries,
  metaverseOwnerships,
  metaverseLeases = [],
}: IGetAggregatedSummary): AggregatedSummary[] {
  return metaverses.map((metaverse, metaverseIndex) => {
    const leases = metaverseLeases[metaverseIndex];
    const traitsPrices = metaverseSummaries[metaverseIndex].traits;
    const ownerships = metaverseOwnerships[metaverseIndex];

    const addressAssetIdToLeaseMap = keyBy(
      (leases || []).flat(),
      (lease) => `${lease.contractAddress}_${lease.tokenId}`,
    );

    // get traits with floor price from collection summaries
    const traitsWithFloorPrice = metaverse.traits.map((filters, traitIndex) => ({
      filters,
      floorPriceInEth: traitsPrices[traitIndex].floorPriceInEth,
      floorPriceInUsd: traitsPrices[traitIndex].floorPriceInUsd,
    }));

    const assetsWithFloorPrice: Asset[] = ownerships.map((asset) => {
      // floor price be collection floor price then match price with filter
      let { floorPriceInEth, floorPriceInUsd } = traitsWithFloorPrice[0];

      asset.traits.forEach((trait) => {
        traitsWithFloorPrice.forEach((traitFilter) => {
          if (!match(traitFilter.filters, trait)) {
            return;
          }
          floorPriceInEth = traitFilter.floorPriceInEth;
          floorPriceInUsd = traitFilter.floorPriceInUsd;
        });
      });
      // special case for decentraland estate
      if (asset.assetContract.address === '0x959e104e1a4db6317fa58f8295f586e1a978c297') {
        const sizeTrait = asset.traits.find((trait) => trait.traitType === 'Size');
        const size = parseInt((sizeTrait && sizeTrait.value) || '1', 10);
        floorPriceInEth *= size;
        floorPriceInUsd *= size;
      }

      const key = `${asset.assetContract.address}_${asset.tokenId}`;
      const lease = addressAssetIdToLeaseMap && addressAssetIdToLeaseMap[key];
      return {
        ...asset,
        lease,
        floorPriceInEth,
        floorPriceInUsd,
      };
    });

    return {
      name: metaverse.label,
      icon: metaverse.icon,
      count: assetsWithFloorPrice.length,
      price: assetsWithFloorPrice.reduce((floorPrice, asset) => asset.floorPriceInEth + floorPrice, 0),
      available: true,
      ownership: assetsWithFloorPrice,
    };
  });
}
