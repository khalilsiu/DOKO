interface AppConfig {
  provider: string;
  moralisServerUrl: string;
  moralisApplicationId: string;
  testAccount?: string;
}

export const config: AppConfig = {
  provider: process.env.REACT_APP_DEFAULT_WEB3_PROVIDER || "",
  moralisServerUrl: process.env.REACT_APP_MORALIS_SERVER_URL || "",
  moralisApplicationId: process.env.REACT_APP_MORALIS_APPLICATION_ID || "",
  testAccount: "0x4ec741b83ec1f0b491152904b1b8383c2975031a",
};
