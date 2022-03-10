import decentralandIcon from '../assets/metaverses/decentraland-icon.png';
import cryptovoxelsIcon from '../assets/metaverses/cryptovoxels-icon.png';
import theSandBoxIcon from '../assets/metaverses/thesandbox-icon.png';
import somniumSpaceIcon from '../assets/metaverses/somniumspace-icon.png';
import decentraland from '../assets/metaverses/decentraland.png';
import cryptovoxels from '../assets/metaverses/cryptovoxels.png';
import theSandBox from '../assets/metaverses/thesandbox.png';
import somniumSpace from '../assets/metaverses/somniumspace.png';
import DclLandAbi from '../contracts/DclLand.json';

const cryptovoxelsIslands = [
  'Origin City',
  'Satoshi',
  'Milan',
  'Scarcity',
  'Tokyo',
  'Vibes',
  'Berlin',
  'Helios',
  'Neutron',
  'Proton',
  '서울',
  'San Francisco',
  'Ceres',
  'Igloo',
  'Proxima',
  'The Bronx',
  'Poneke',
  'Trinity',
  'Honolulu',
  'Pilikai',
  'Far Far Away',
  'Euro',
  'Kauai',
  '新宿区',
  'München',
  'Electron',
  'Pluto',
  'Little Ceres',
];

const somniumParcelSizes = ['S', 'M', 'XL'];

export type Metaverse = 'decentraland' | 'cryptovoxel' | 'sandbox' | 'somnium-space';

const metaverses = [
  {
    icon: decentralandIcon,
    image: decentraland,
    name: 'decentraland',
    label: 'Decentraland',
    slug: 'decentraland',
    primaryAddress: '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
    primaryTraitTypes: [],
    addresses: ['0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d', '0x959e104e1a4db6317fa58f8295f586e1a978c297'],
    traits: [[]],
    contracts: [
      {
        label: 'DCL Land',
        symbol: 'dclLand',
        // for testnet purpose
        address: process.env.REACT_APP_DCL_LAND_ADDRESS || '',
        abi: DclLandAbi,
      },
    ],
  },
  {
    icon: theSandBoxIcon,
    image: theSandBox,
    name: 'the-sandbox',
    label: 'The Sandbox',
    slug: 'sandbox',
    primaryAddress: '0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a',
    addresses: ['0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a'],
    traits: [[]],
    primaryTraitTypes: [],
    contracts: [],
  },
  {
    icon: cryptovoxelsIcon,
    image: cryptovoxels,
    name: 'cryptovoxels',
    label: 'Cryptovoxels',
    slug: 'cryptovoxels',
    primaryAddress: '0x79986af15539de2db9a5086382daeda917a9cf0c',
    addresses: ['0x79986af15539de2db9a5086382daeda917a9cf0c'],
    primaryTraitTypes: ['island'],
    traits: [
      [],
      ...cryptovoxelsIslands.map((island) => [
        {
          traitType: 'island',
          value: island,
          operator: '=',
        },
      ]),
    ],
    contracts: [],
  },
  {
    icon: somniumSpaceIcon,
    image: somniumSpace,
    name: 'somnium-space',
    label: 'Somnium Space VR',
    slug: 'somnium-space',
    primaryAddress: '0x913ae503153d9a335398d0785ba60a2d63ddb4e2',
    addresses: ['0x913ae503153d9a335398d0785ba60a2d63ddb4e2'],
    primaryTraitTypes: ['Parcel size'],
    traits: [
      [],
      ...somniumParcelSizes.map((size) => [
        {
          traitType: 'Parcel size',
          value: size,
          operator: '=',
        },
      ]),
    ],
    contracts: [],
  },
];

export default metaverses;
