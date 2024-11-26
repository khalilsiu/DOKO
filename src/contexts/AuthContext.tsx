import React from 'react';
import { Wallet, WalletName } from 'types';
import { useDispatch } from 'react-redux';
import { openToast } from 'store/app/appStateSlice';
import { injected } from 'config/injected';
import { useWeb3React } from '@web3-react/core';
import DOKOMetamaskLogoAsset from 'assets/doko/doko-metamask-logo-asset.png';
import { AuthModal } from 'components/auth/AuthModal';
import { ethers } from 'ethers';
import config from 'config';
import { DeviceCheckUtil } from 'utils/DeviceCheckUtil';
import { ThirdPartyURL } from 'constants/ThirdPartyURL';
import { web3 } from 'libs/web3';

const {
  targetChainId,
  targetRpcUrl,
  targetChainName,
  targetNativeName,
  targetNativeSymbol,
  targetNativeDecimals,
  targetExplorerUrl,
} = config;

declare let window: any;
export interface AuthContextType {
  isActive: boolean;
  isCorrectNetwork: boolean;
  address: string;
  connect: () => void;
  disconnect: () => Promise<void>;
  checkAndSwitchNetwork: () => Promise<void>;
  signer: ethers.Signer | null;
  setSigner: React.Dispatch<React.SetStateAction<ethers.providers.JsonRpcSigner | null>>;
}

const wallets: Wallet[] = [
  {
    icon: DOKOMetamaskLogoAsset,
    label: 'MetaMask Wallet',
    name: WalletName.METAMASK,
  },
];

export const AuthContext = React.createContext<AuthContextType>(null as any);

export const AuthContextProvider = React.memo(({ children }) => {
  const dispatch = useDispatch();

  const [address, setAddress] = React.useState('');
  const [walletSelected, setWalletSelected] = React.useState<Wallet>(wallets[0]);
  const [walletModalVisible, setWalletModalVisible] = React.useState(false);

  const { account, active, error, activate, deactivate, chainId } = useWeb3React();
  const [isActive, setIsActive] = React.useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = React.useState(false);
  const [signer, setSigner] = React.useState<ethers.providers.JsonRpcSigner | null>(null);

  const showInstallMetamaskToastOrElseRedirect = React.useCallback(
    (autoRedirect = false) => {
      if (DeviceCheckUtil.isMobile()) {
        if (autoRedirect) window.location.href = ThirdPartyURL.downloadMetamask();
      } else {
        dispatch(
          openToast({
            message: 'Please install Metamask wallet extension in Chrome to connect.',
            state: 'error',
            action: 'install-metamask',
          }),
        );
      }
    },
    [dispatch, openToast],
  );

  const connectMetamask = React.useCallback(async () => {
    try {
      new ethers.providers.Web3Provider(window.ethereum); // test if metamask is available

      await activate(injected);
    } catch (e: any) {
      console.error(e);
      if (e.reason === 'missing provider') {
        // User has not installed Google Chrome Metamask extension yet
        showInstallMetamaskToastOrElseRedirect(true);
      } else {
        dispatch(openToast({ message: `Error on connecting to Metamask ${e}`, state: 'error' }));
      }
    }
  }, [activate, dispatch]);

  const disconnectMetamask = React.useCallback(async () => {
    try {
      await deactivate();
    } catch (e) {
      dispatch(openToast({ message: `Error on disconnecting from App ${e}`, state: 'error' }));
    }
  }, [deactivate, dispatch]);

  const checkAndSwitchNetwork = React.useCallback(async () => {
    if (isCorrectNetwork) return;

    try {
      console.log('changing');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(targetChainId) }],
      });
    } catch (e: any) {
      console.log(e);
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: targetChainName,
              chainId: web3.utils.toHex(targetChainId),
              nativeCurrency: {
                name: targetNativeName,
                decimals: targetNativeDecimals,
                symbol: targetNativeSymbol,
              },
              rpcUrls: [targetRpcUrl],
              blockExplorerUrls: [targetExplorerUrl],
            },
          ],
        });
      }
      throw new Error('Please switch to the correct network');
    }

    console.log('NO ERROR');
  }, [isCorrectNetwork]);

  const login = React.useCallback(async () => {
    await connectMetamask();
    setWalletModalVisible(false);
  }, []);

  // check when app is connected to metamask as
  const handleIsActive = React.useCallback(async () => {
    const isAuthorized = await injected.isAuthorized();
    if (isAuthorized && !active && !error) {
      await activate(injected);
    }
  }, [active, injected, error]);

  const handleConnectButtonClick = React.useCallback(() => {
    setWalletModalVisible(true);
  }, [setWalletModalVisible]);

  React.useEffect(() => {
    handleIsActive();
  }, [active, injected, error]);

  React.useEffect(() => {
    if (account) {
      setAddress(account.toLowerCase());
    }
  }, [account]);

  React.useEffect(() => {
    setIsActive(active);
  }, [active]);

  React.useEffect(() => {
    setIsCorrectNetwork(chainId == Number(config.targetChainId));
  }, [chainId]);

  React.useEffect(() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const signer = provider.getSigner();
      setSigner(signer);
    } catch (e: any) {
      if (e.reason === 'missing provider') {
        // User has not installed Google Chrome Metamask extension yet
        showInstallMetamaskToastOrElseRedirect();
      }
    }
  }, [showInstallMetamaskToastOrElseRedirect, chainId]);

  return (
    <AuthContext.Provider
      value={{
        address,
        signer,
        setSigner,
        connect: handleConnectButtonClick,
        disconnect: disconnectMetamask,
        checkAndSwitchNetwork,
        isCorrectNetwork,
        isActive,
      }}
    >
      <React.Fragment>
        {children}

        <AuthModal
          showModal={walletModalVisible}
          wallets={wallets}
          selectedWallet={walletSelected}
          setSelectedWallet={setWalletSelected}
          closeModal={() => setWalletModalVisible(false)}
          login={login}
        />
      </React.Fragment>
    </AuthContext.Provider>
  );
});
