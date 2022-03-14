// interface AppConfig {
//   polygon_provider: string;
//   moralisServerUrl: string;
//   moralisApplicationId: string;
//   moralisApiKey: string;
//   testAccount: string;
//   apiUrl: string;
// }

// export const config: AppConfig = {
//   polygon_provider: process.env.REACT_APP_POLYGON_PROVIDER || '',
//   moralisServerUrl: process.env.REACT_APP_MORALIS_SERVER_URL || '',
//   moralisApplicationId: process.env.REACT_APP_MORALIS_APPLICATION_ID || '',
//   moralisApiKey: process.env.REACT_APP_MORALIS_API_KEY || '',
//   testAccount: '0x4ec741b83ec1f0b491152904b1b8383c2975031a',
//   apiUrl: process.env.REACT_APP_API_URL || '',
// };

// export default config;

interface AppConfig {
  provider: string;
  holdingsServiceUrl: string;
  holdingsServiceSocketUrl: string;
  dclLandRentalAddress: string;
  dclLandAddress: string;
  usdtAddress: string;
  usdtDecimals: number;
}

export const config: AppConfig = {
  provider: process.env.REACT_APP_DEFAULT_WEB3_PROVIDER || '',
  holdingsServiceUrl: process.env.REACT_APP_HOLDINGS_SERVICE_API || '',
  holdingsServiceSocketUrl: process.env.REACT_APP_HOLDINGS_SERVICE_SOCKET || '',
  dclLandRentalAddress: process.env.REACT_APP_DCL_LAND_RENTAL_ADDRESS || '',
  dclLandAddress: process.env.REACT_APP_DCL_LAND_ADDRESS || '',
  usdtAddress: process.env.REACT_APP_USDT_ADDRESS || '',
  usdtDecimals: parseInt(process.env.REACT_APP_USDT_DECIMALS || '0', 10),
};

console.log('CONFIG', config);

export default config;
