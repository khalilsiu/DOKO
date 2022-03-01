export interface FetchEthereumParams {
  id: string;
  address: string;
}

export interface FetchSolanaNFTParams {
  id: string;
}

export interface NFT {
  tokenId: string;
  contractAddress: string;
  name: string | null;
  ownerAddress: string | null;
  creatorAddress: string | null;
  imageURL: string | null;
  description: string | null;
  collection: string | null;
  traits: Trait[];
  slug: string | null;
  floorPrice: number | null;
  metaverseName: string | null;
  externalLink: string | null;
  lastPurchasePriceETH: number | null;
  lastPurchasePriceUSD: number | null;
  tokenStandard: string | null;
}

export interface Trait {
  type: string;
  value: string;
}

export interface State {
  nft: NFT | null;
}
