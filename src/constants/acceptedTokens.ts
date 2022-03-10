import Erc20Token from '../contracts/Erc20Token.json';
import ethIcon from 'assets/tokens/eth.png';
import usdtIcon from 'assets/tokens/usdt.png';

export const tokens = [
  {
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    label: '[ETH] Ethereum',
    icon: ethIcon,
    decimals: 18,
    abi: [],
  },
  {
    symbol: 'USDT',
    address: process.env.REACT_APP_USDT_ADDRESS || '',
    label: '[USDT] Tether',
    icon: usdtIcon,
    decimals: parseInt(process.env.REACT_APP_USDT_DECIMALS || '18', 10),
    abi: Erc20Token.abi,
  },
  // {
  //   symbol: 'WETH',
  //   address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //   label: '[WETH] Wapped Ethereum',
  //   decimals: 18,
  // },
  // {
  //   symbol: 'DAI',
  //   address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  //   label: '[DAI] DAI',
  //   icon: '/dai.png',
  //   decimals: 18,
  // },
  // {
  //   symbol: 'USDC',
  //   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  //   label: '[USDC] USDC',
  //   icon: '/usdc.png',
  //   decimals: 6,
  // },
  // {
  //   symbol: 'MANA',
  //   address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  //   label: '[MANA] Mana',
  //   icon: '/mana.png',
  //   decimals: 18,
  // },
];

export enum AcceptedTokens {
  ETH = 'ETH',
  USDT = 'USDT',
  // WETH = 'WETH',
  // DAI = 'DAI',
  // USDC = 'USDC',
  // MANA = 'MANA',
}
