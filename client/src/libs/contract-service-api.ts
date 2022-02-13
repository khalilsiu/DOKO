import axios from 'axios';
import { AcceptedTokens } from '../constants/acceptedTokens';
import { Filter } from '../hooks/useProfileSummaries';

const instance = axios.create({
  baseURL: process.env.REACT_APP_CONTRACT_SERVICE_API,
});

interface LeaseDetails {
  rentToken: AcceptedTokens;
  rentAmount: number;
  deposit: number;
  gracePeriod: number;
  minLeaseLength: number;
  maxLeaseLength: number;
  autoRegenerate: boolean;
  tokenId: string;
  rentorAddress: string;
  contractAddress: string;
  // isOpen: boolean;
  // isLeased: boolean;
  // renteeAddress: string;
  // monthsPaid: number
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

  static async createLease(leaseDetails: LeaseDetails) {
    const res = await instance
      .post('lease', {
        ...leaseDetails,
        isOpen: true,
        isLeased: false,
        renteeAddress: '0x0000000000000000000000000000000000000000',
        monthsPaid: 0,
      })
      .then((res) => res.data);
    return res;
  }
}
