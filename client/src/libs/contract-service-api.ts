import axios from 'axios';
import { Filter } from '../hooks/useProfileSummaries';

export default class ContractServiceAPI {
  static async getAssetFloorPrice(address: string, traits: Filter[]) {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_CONTRACT_SERVICE_API,
    });
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
}
