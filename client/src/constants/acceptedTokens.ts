export const tokens = [
  {
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    label: '[ETH] Ethereum',
    icon: '/ethereum.png',
    decimals: 18,
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
  {
    symbol: 'USDT',
    address:
      process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_USDT_ADDRESS || ''
        : '0xdac17f958d2ee523a2206206994597c13d831ec7',
    label: '[USDT] Tether',
    icon: '/usdt.png',
    decimals: process.env.NODE_ENV === 'development' ? 18 : 6,
  },
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
  WETH = 'WETH',
  DAI = 'DAI',
  USDC = 'USDC',
  USDT = 'USDT',
  MANA = 'MANA',
}
