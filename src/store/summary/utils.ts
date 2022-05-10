import metaverses from 'constants/metaverses';
import { pick } from 'lodash';
import OpenSeaAPI from '../../libs/opensea-api';
import { getCoordinates, camelize } from 'utils/utils';
import { parsePriceETH, parsePriceUSD } from './metaverseSummary';
import { Asset } from '../profile/profileOwnershipSlice';

export const getMetaverseName = (slug: string): string | null => {
  switch (slug) {
    case 'decentraland':
      return 'Decentraland';

    case 'cryptovoxels':
      return 'Cryptovoxels';

    case 'somnium-space':
      return 'Somnium Space';

    case 'sandbox':
      return 'The Sandbox';

    default:
      return null;
  }
};

export const processAssetFromOpensea = (asset: any): Asset => {
  const picked = pick(asset, [
    'id',
    'token_id',
    'image_url',
    'image_preview_url',
    'image_thumbnail_url',
    'image_original_url',
    'name',
    'description',
    'asset_contract',
    'traits',
    'owner',
    'creator',
    'collection',
    'external_link',
    'last_sale',
  ]);
  picked.asset_contract = pick(picked.asset_contract, ['address', 'schema_name']);
  picked.traits = picked.traits.map((trait) => pick(trait, ['trait_type', 'value']));

  const slug = picked.collection?.slug;
  const metaverseName = getMetaverseName(picked.collection.slug);
  const owner = picked.owner?.address;
  const creatorAddress = picked.creator?.address;
  const collection = picked.asset_contract?.name;
  const tokenStandard = picked.asset_contract?.schema_name;
  const externalLink = picked.external_link;

  const lastPurchasePriceEth = picked?.last_sale
    ? parsePriceETH(picked.last_sale?.total_price, picked.last_sale?.payment_token)
    : 0;
  const lastPurchasePriceUsd = picked?.last_sale
    ? parsePriceUSD(picked.last_sale?.total_price, picked.last_sale?.payment_token)
    : 0;

  const coordinates: L.LatLngExpression = getCoordinates(asset.collection.name, asset);
  return camelize<Asset>({
    ...picked,
    coordinates,
    metaverseName,
    owner,
    creatorAddress,
    collection,
    tokenStandard,
    slug,
    externalLink,
    lastPurchasePriceEth,
    lastPurchasePriceUsd,
  });
};

export const fetchMetaverseAssets = async (address: string) => {
  let assetsFromResponse: any[] = [''];
  let offset = 0;
  const assets: any[] = [];
  const nfts: Asset[][] = Array(metaverses.length)
    .fill(null)
    .map(() => []);
  while (assetsFromResponse.length) {
    const params = new URLSearchParams();
    params.append('limit', '50');
    params.append('owner', address);
    params.append('offset', offset.toString());
    metaverses
      .flatMap((metaverse) => metaverse.addresses)
      .forEach((contractAddress) => {
        params.append('asset_contract_addresses', contractAddress);
      });

    const response = await OpenSeaAPI.get('/assets', { params });
    assetsFromResponse = response.data.assets;
    assets.push(...assetsFromResponse);
    offset += 50;
  }

  assets.forEach((asset) => {
    if (!asset.asset_contract) {
      return;
    }
    metaverses.forEach((metaverse, index) => {
      // no differentiation within same collection
      if (metaverse.addresses.includes(asset.asset_contract.address)) {
        nfts[index].push(processAssetFromOpensea(asset));
      }
    });
  });
  return nfts;
};
