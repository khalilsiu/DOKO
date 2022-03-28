import { MetaverseSummary } from '../../store/summary/metaverseSummary';
import { Dictionary, keyBy } from 'lodash';

import metaverses from '../../constants/metaverses';
import { Trait, Asset } from '../../store/profile/profileOwnershipSlice';
import { Lease } from 'store/lease/leasesSlice';

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
  totalFloorPrice: number;
  assets: Asset[];
  leasedAssets: Asset[];
  rentedAssets: Asset[];
}

interface IGetAggregatedSummary {
  metaverseSummaries: MetaverseSummary[];
  metaverseAssets: Asset[][];
  metaverseLeasedAssets?: Asset[][];
  metaverseRentedAssets?: Asset[][];
}

interface TraitWithFloorPrice {
  filters: Filter[];
  floorPriceInEth: number;
  floorPriceInUsd: number;
}

const combineAssetWithFloorPrice = (
  asset: Asset,
  traitsWithFloorPrice: TraitWithFloorPrice[],
  addressAssetIdToLeaseMap?: Dictionary<Lease>,
) => {
  // floor price is collection floor price then match price with filter
  // to avoid nil
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
  const lease = addressAssetIdToLeaseMap ? addressAssetIdToLeaseMap[key] : asset.lease;
  return {
    ...asset,
    lease,
    floorPriceInEth,
    floorPriceInUsd,
  };
};

export function aggregateSummaries({
  metaverseSummaries,
  metaverseAssets,
  metaverseLeasedAssets = [],
  metaverseRentedAssets = [],
}: IGetAggregatedSummary): AggregatedSummary[] {
  return metaverses.map((metaverse, metaverseIndex) => {
    const leasedAssets = metaverseLeasedAssets[metaverseIndex];
    const rentedAssets = metaverseRentedAssets[metaverseIndex];
    const leases = leasedAssets.map((asset) => asset.lease as Lease);
    const traitsPrices = metaverseSummaries[metaverseIndex].traits;
    const assets = metaverseAssets[metaverseIndex];

    const addressAssetIdToLeaseMap = keyBy(leases, (lease) => `${lease.contractAddress}_${lease.tokenId}`);

    // get traits with floor price from collection summaries
    const traitsWithFloorPrice = metaverse.traits.map((filters: Filter[], traitIndex) => ({
      filters,
      floorPriceInEth: traitsPrices[traitIndex].floorPriceInEth,
      floorPriceInUsd: traitsPrices[traitIndex].floorPriceInUsd,
    }));

    const assetsWithFloorPrice: Asset[] = assets.map((asset) =>
      combineAssetWithFloorPrice(asset, traitsWithFloorPrice, addressAssetIdToLeaseMap),
    );

    const leasedAssetsWithFloorPrice: Asset[] = leasedAssets.map((asset) =>
      combineAssetWithFloorPrice(asset, traitsWithFloorPrice),
    );

    const rentedAssetsWithFloorPrice: Asset[] = rentedAssets.map((asset) =>
      combineAssetWithFloorPrice(asset, traitsWithFloorPrice),
    );

    return {
      name: metaverse.label,
      icon: metaverse.icon,
      count: assetsWithFloorPrice.length,
      totalFloorPrice: assetsWithFloorPrice.reduce((floorPrice, asset) => asset.floorPriceInEth + floorPrice, 0),
      assets: assetsWithFloorPrice,
      leasedAssets: leasedAssetsWithFloorPrice,
      rentedAssets: rentedAssetsWithFloorPrice,
    };
  });
}
