import { InjectedConnector } from '@web3-react/injected-connector';

// 1 = Ethereum Mainnet
// 42 = Kovan Testnet
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 1337] });
