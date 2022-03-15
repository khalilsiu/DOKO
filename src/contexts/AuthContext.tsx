import React from 'react';
import { Wallet, WalletName } from 'types';
import { useDispatch } from 'react-redux';
import { openToast } from 'store/app/appStateSlice';
import { injected } from 'config/injected';
import { useWeb3React } from '@web3-react/core';
import DOKOMetamaskLogoAsset from 'assets/doko/doko-metamask-logo-asset.png';
import { AuthModal } from 'components/auth/AuthModal';
export interface AuthContextType {
  isActive: boolean;
  address: string;
  connect: () => void;
  disconnect: () => Promise<void>;
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

  const { account, active, error, activate, deactivate } = useWeb3React();
  const [isActive, setIsActive] = React.useState(false);

  const connectMetamask = React.useCallback(async () => {
    try {
      await activate(injected);
    } catch (e) {
      dispatch(openToast({ message: `Error on connecting to Metamask ${e}`, state: 'error' }));
    }
  }, [activate, dispatch]);

  const disconnectMetamask = React.useCallback(async () => {
    try {
      await deactivate();
    } catch (e) {
      dispatch(openToast({ message: `Error on disconnecting from App ${e}`, state: 'error' }));
    }
  }, [deactivate, dispatch]);

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
  return (
    <AuthContext.Provider
      value={{
        address,
        connect: () => setWalletModalVisible(true),
        disconnect: disconnectMetamask,
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
