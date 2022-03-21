import metaverses from 'constants/metaverses';
import { Fragment, memo, useCallback, useState } from 'react';
import AssetMapSection from './AssetMapSection';
import { Asset } from 'store/profile/profileOwnershipSlice';
import { LeaseMode } from './OwnershipView';

interface Props {
  name: string;
  assets: Asset[];
}

interface IMetaverseMapSection {
  metaverseMapSectionProps: Props[];
  mode: LeaseMode;
}
export type ViewOption = 'list' | 'map';

const MetaverseMapSection = ({ metaverseMapSectionProps, mode }: IMetaverseMapSection) => {
  const [views, setViews] = useState<Array<ViewOption>>(metaverses.map(() => 'list'));
  const [paginations, setPaginations] = useState(metaverses.map(() => 1));
  const [collectionAssetSelected, setCollectionAssetSelected] = useState<Array<number | null>>(
    metaverses.map(() => null),
  );

  const onAssetClick = (collectionIndex: number, index: number) => {
    const copy = collectionAssetSelected.slice();
    copy[collectionIndex] = index;
    setCollectionAssetSelected(copy);
  };

  const onViewClick = useCallback(
    (viewOption: ViewOption, metaverseIndex: number) => {
      const newViews = views.slice();
      newViews[metaverseIndex] = viewOption;
      setViews(newViews);
    },
    [views],
  );

  const onPageChange = useCallback(
    (page: number, metaverseIndex: number) => {
      const newPaginations = paginations.slice();
      newPaginations[metaverseIndex] = page;
      setPaginations(newPaginations);
    },
    [views],
  );

  return (
    <Fragment>
      {metaverseMapSectionProps.map((metaverse, metaverseIndex) => (
        <AssetMapSection
          metaverseName={metaverse.name}
          assets={metaverse.assets}
          metaverseIndex={metaverseIndex}
          onAssetClick={onAssetClick}
          view={views[metaverseIndex]}
          onViewClick={onViewClick}
          page={paginations[metaverseIndex]}
          onPageChange={onPageChange}
          assetSelectedForMap={collectionAssetSelected[metaverseIndex]}
          mode={mode}
        />
      ))}
    </Fragment>
  );
};

export default memo(MetaverseMapSection);
