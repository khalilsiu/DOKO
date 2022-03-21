import axios from 'axios';
import { Filter } from '../hooks/summary/aggregateSummaries';
import { Metaverse } from 'constants/metaverses';
import config from 'config';

const instance = axios.create({
  baseURL: config.holdingsServiceUrl,
});

export interface SortOption {
  field: string;
  order: string;
}
export interface IGetLeasedAssets {
  lessor?: string;
  lessee?: string;
  contractAddress?: string;
  isOpen?: boolean;
  sort?: SortOption[];
}
export interface IGetLeasedAsset {
  contractAddress: string;
  tokenId: string;
}

export default class ContractServiceAPI {
  static async getAssetFloorPrice(address: string, traits: Filter[]) {
    const res = await instance
      .post('asset/floor-price', {
        address,
        traits,
      })
      .then((res) => res.data)
      .catch((err) => {
        if (err.response.status === 404) {
          return {
            price: 0,
            payment_token: {
              address: '0x0000000000000000000000000000000000000000',
              decimals: 18,
              eth_price: '1.000000000000000',
              symbol: 'ETH',
            },
          };
        }
        throw err;
      });
    return res;
  }

  static async getLeasedAssets(payload: IGetLeasedAssets) {
    const res = await instance.post('lease/filter', payload).then((res) => res.data);
    return res;
  }

  static async getLeasedAsset(payload: IGetLeasedAsset) {
    const { contractAddress, tokenId } = payload;
    const body = {
      contractAddress,
      tokenIds: [tokenId],
      sort: [
        {
          field: 'created_at',
          order: 'desc',
        },
      ],
    };
    const res = await instance.post('lease/filter', body).then((res) => res.data[0] || {});
    return res;
  }

  static async getStats(metaverse: Metaverse) {
    const res = await instance
      .get('/stats', {
        params: {
          metaverse,
        },
      })
      .then((res) => res.data);
    return res;
  }
}
