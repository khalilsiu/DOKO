interface AppConfig {
  provider: string;
  moralisServerUrl: string;
  moralisApplicationId: string;
}

export const config: AppConfig = {
  provider: process.env.REACT_APP_DEFAULT_WEB3_PROVIDER || "",
  moralisServerUrl: process.env.REACT_APP_MORALIS_SERVER_URL || "",
  moralisApplicationId: process.env.REACT_APP_MORALIS_APPLICATION_ID || "",
};
