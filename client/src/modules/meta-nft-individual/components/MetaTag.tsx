import { Meta } from 'components';
import React from 'react';
import { Asset } from 'store/summary';

interface Props {
  asset: Asset;
}

export const MetaTag = React.memo<Props>(({ asset }) => {
  if (!asset?.id) {
    return null;
  }

  return (
    <Meta
      title={`${asset.name} | DOKO`}
      description={asset.description || ''}
      url="https://doko.one"
      image={asset.imageUrl ?? ''}
    />
  );
});
