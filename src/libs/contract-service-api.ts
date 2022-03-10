import axios from 'axios';
<<<<<<< HEAD:src/libs/contract-service-api.ts
import { Filter } from '../hooks/summary/aggregateMetaverseSummaries';
=======
import { Metaverse } from 'constants/metaverses';
import { Filter } from '../hooks/useProfileSummaries';
>>>>>>> e262d56dc533d3f974edd4102923ae9253e8d5e0:client/src/libs/contract-service-api.ts

const instance = axios.create({
  baseURL: process.env.REACT_APP_HOLDINGS_SERVICE_API,
});

export interface SortOption {
  field: string;
  order: string;
}
export interface IGetLeases {
  lessor?: string;
  contractAddress: string;
  isOpen?: boolean;
  sort?: SortOption[];
}

export interface IGetLease {
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

  static async getLeases(payload: IGetLeases) {
    const res = await instance.post('lease/filter', payload).then((res) => res.data);
    return res;
  }

  static async getLease(payload: IGetLease) {
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
