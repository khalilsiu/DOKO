import axios from 'axios';
import { Filter } from '../hooks/useProfileSummaries';

const instance = axios.create({
  baseURL: process.env.REACT_APP_CONTRACT_SERVICE_API,
});

export interface IGetLease {
  lessor: string;
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

  static async getLease(payload: IGetLease) {
    const body = Object.keys(payload).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          operator: '=',
          value: payload[key],
        },
      }),
      {},
    );
    const res = await instance.post('lease/filter', body).then((res) => res.data);
    return res;
  }
}
