interface AppConfig {
  targetChainId: string;
  targetRpcUrl: string;
  targetChainName: string;
  targetNativeName: string;
  targetNativeSymbol: string;
  targetNativeDecimals: string;
  targetExplorerUrl: string;
  provider: string;
  holdingsServiceUrl: string;
  holdingsServiceSocketUrl: string;
  dclLandRentalAddress: string;
  dclLandAddress: string;
  usdtAddress: string;
  usdtDecimals: number;
}

export const config: AppConfig = {
  targetChainId: process.env.REACT_APP_CHAIN_ID || '',
  targetRpcUrl: process.env.REACT_APP_RPC_URL || '',
  targetChainName: process.env.REACT_APP_CHAIN_NAME || '',
  targetNativeName: process.env.REACT_APP_NATIVE_CURRENCY_NAME || '',
  targetNativeSymbol: process.env.REACT_APP_NATIVE_CURRENCY_SYMBOL || '',
  targetNativeDecimals: process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || '',
  targetExplorerUrl: process.env.REACT_APP_BLOCK_EXPLORER_URL || '',
  provider: process.env.REACT_APP_DEFAULT_WEB3_PROVIDER || '',
  holdingsServiceUrl: process.env.REACT_APP_HOLDINGS_SERVICE_API || '',
  holdingsServiceSocketUrl: process.env.REACT_APP_HOLDINGS_SERVICE_SOCKET || '',
  dclLandRentalAddress: process.env.REACT_APP_DCL_LAND_RENTAL_ADDRESS || '',
  dclLandAddress: process.env.REACT_APP_DCL_LAND_ADDRESS || '',
  usdtAddress: process.env.REACT_APP_USDT_ADDRESS || '',
  usdtDecimals: parseInt(process.env.REACT_APP_USDT_DECIMALS || '0', 10),
};

export default config;
