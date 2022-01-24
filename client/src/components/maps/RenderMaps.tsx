import { Asset } from '../../store/meta-nft-collections/profileOwnershipSlice';
import DecentralandMap from './DecentralandMap';
import CryptovoxelsMap from './CryptovoxelsMap';
import SomniumSpaceMap from './SomniumSpaceMap';
import SandboxMap from './SandboxMap';

interface RenderMapsProps {
  metaverseName: string;
  assets: Asset[];
  assetsSelected: Array<number | null>;
}

const RenderMaps = ({ metaverseName, assets, assetsSelected }: RenderMapsProps) => {
  return (
    <div>
      {metaverseName === 'Decentraland' ? (
        <DecentralandMap assets={assets} selected={assetsSelected[0]} />
      ) : metaverseName === 'The Sandbox' ? (
        <SandboxMap assets={assets} selected={assetsSelected[1]} />
      ) : metaverseName === 'Cryptovoxels' ? (
        <CryptovoxelsMap assets={assets} selected={assetsSelected[2]} />
      ) : (
        <SomniumSpaceMap assets={assets} selected={assetsSelected[3]} />
      )}
    </div>
  );
};

export default RenderMaps;
