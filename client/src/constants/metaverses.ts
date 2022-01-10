import decentraland from '../assets/decentraland.png';
import cryptovoxels from '../assets/cryptovoxels.png';
import thesandbox from '../assets/thesandbox.png';
import somnium from '../assets/somnium.png';

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

const metaverses = [
  {
    icon: decentraland,
    name: 'decentraland',
    label: 'Decentraland',
    slug: 'decentraland',
    primaryAddress: '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
    primaryTraitTypes: [],
    addresses: [
      '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
      '0x959e104e1a4db6317fa58f8295f586e1a978c297',
    ],
    traits: [[]],
  },
  {
    icon: thesandbox,
    name: 'sandbox',
    label: 'Sandbox',
    slug: 'sandbox',
    primaryAddress: '0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a',
    addresses: ['0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a'],
    traits: [[]],
    primaryTraitTypes: [],
  },
  {
    icon: cryptovoxels,
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
  },

  {
    icon: somnium,
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
  },
];

export default metaverses;
