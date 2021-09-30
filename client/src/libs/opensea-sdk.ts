import { OpenSeaPort, Network } from 'opensea-js';
import Web3 from 'web3';

const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io');

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main,
});

export default seaport;
