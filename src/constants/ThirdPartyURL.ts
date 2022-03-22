import { EnvironmentUtil } from 'utils/EnvironmentUtil';

export const ThirdPartyURL = Object.freeze({
  downloadMetamask: () => {
    const env = EnvironmentUtil.getEnvironment();

    const baseURL = 'https://metamask.app.link/dapp/';

    switch (env) {
      case 'dev':
        return baseURL + 'dev.doko.one';
      case 'staging':
        return baseURL + 'staging.doko.one';
      case 'production':
        return baseURL + 'doko.one';
    }
  },
});
