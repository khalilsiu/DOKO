import DecentralandMap from './DecentralandMap';
import CryptovoxelsMap from './CryptovoxelsMap';
import SomniumSpaceMap from './SomniumSpaceMap';
import SandboxMap from './SandboxMap';
import { Asset } from '../../store/summary/profileOwnershipSlice';

interface RenderMapsProps {
  metaverseName: string;
  assetsSelected: Array<number | null>;
  assets: Asset[];
}

const RenderMaps = ({ metaverseName, assetsSelected, assets }: RenderMapsProps) => {
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
