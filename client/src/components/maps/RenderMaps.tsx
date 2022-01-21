import 'leaflet/dist/leaflet.css';
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
      {metaverseName === 'Cryptovoxels' ? (
        <CryptovoxelsMap assets={assets} selected={assetsSelected[2]} />
      ) : metaverseName === 'Decentraland' ? (
        <DecentralandMap assets={assets} selected={assetsSelected[0]} />
      ) : metaverseName === 'Somnium Space VR' ? (
        <SomniumSpaceMap assets={assets} selected={assetsSelected[3]} />
      ) : (
        <SandboxMap assets={assets} selected={assetsSelected[1]} />
      )}
    </div>
  );
};

export default RenderMaps;
