import DecentralandMap from './DecentralandMap';
import CryptovoxelsMap from './CryptovoxelsMap';
import SomniumSpaceMap from './SomniumSpaceMap';
import SandboxMap from './SandboxMap';
import { Asset } from '../../store/profile/profileOwnershipSlice';
import { memo } from 'react';

interface RenderMapsProps {
  metaverseName: string;
  assetSelected: number | null;
  assets: Asset[];
}

const RenderMaps = ({ metaverseName, assetSelected, assets }: RenderMapsProps) => {
  return (
    <div>
      {metaverseName === 'Decentraland' ? (
        <DecentralandMap assets={assets} selected={assetSelected} />
      ) : metaverseName === 'The Sandbox' ? (
        <SandboxMap assets={assets} selected={assetSelected} />
      ) : metaverseName === 'Cryptovoxels' ? (
        <CryptovoxelsMap assets={assets} selected={assetSelected} />
      ) : (
        <SomniumSpaceMap assets={assets} selected={assetSelected} />
      )}
    </div>
  );
};

export default memo(RenderMaps);
