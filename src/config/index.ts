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

export default config;
