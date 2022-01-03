import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import metaverses from '../constants/metaverses';
import { Trait } from '../store/meta-nft-collections/userOwnershipSlice';
import { RootState } from '../store/store';

interface Filter {traitType: string; value: any; operator: string ;
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

const useMetaverseSummaries = () => {
  const { isLoading: ownershipsIsLoading, ownerships } = useSelector(
    (state: RootState) => state.userOwnership,
  );
  const { isLoading: summaryIsLoading, summaries: collectionSummaries } = useSelector(
    (state: RootState) => state.collectionSummary,
  );

  const metaverseSummaries = useMemo(
    () => metaverses.map((metaverse, metaverseIndex) => {
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
          const size = parseInt((sizeTrait || { value: '1' }).value, 10);
          floorPrice *= size;
        }
        return {
          ...asset,
          floorPrice,
        };
      });

      return {
        name: metaverse.label,
        icon: metaverse.icon,
        count: assetsWithFloorPrice.length,
        price: assetsWithFloorPrice.reduce((floorPrice, asset) => asset.floorPrice + floorPrice, 0),
        available: true,
        loading: ownershipsIsLoading || summaryIsLoading,
        ownership: assetsWithFloorPrice,
      };
    }),
    [collectionSummaries, ownerships, summaryIsLoading, ownershipsIsLoading],
  );

  return { metaverseSummaries };
};

export default useMetaverseSummaries;
