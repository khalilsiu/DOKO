import { default as Axios, AxiosInstance } from 'axios';
import { CHAINS } from '../constants';

export const apis: { [key: string]: AxiosInstance } = {
  eth: Axios.create({
    baseURL: 'https://api.etherscan.io/api',
  }),
  bsc: Axios.create({
    baseURL: 'https://api.bscscan.com/api',
  }),
  polygon: Axios.create({
    baseURL: 'https://api.polygonscan.com/api',
  }),
};

for (const chain of CHAINS) {
  apis[chain].interceptors.request.use((config) => {
    config.params.apikey = process.env[`${chain.toUpperCase()}_SCAN_API_KEY`];
    console.log(config.params);
    return config;
  });
}
