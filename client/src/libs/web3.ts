import Web3 from 'web3';
import { config } from '../config';

export const web3 = new Web3(config.provider);
export const polygon = new Web3(config.polygon_provider);
