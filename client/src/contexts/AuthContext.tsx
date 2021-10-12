import { useMetaMask } from 'metamask-react';
import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { WalletName } from '../types';

interface AuthContextValue {
  address: string | null;
  loading: boolean;
  walletName?: WalletName;
  // eslint-disable-next-line no-unused-vars
  login: (wallet: WalletName) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  address: null,
  loading: false,
  login: () => null,
  walletName: undefined,
});

export const AuthContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [loading, setLoading] = useState(false);
  const { account, connect } = useMetaMask();
  const history = useHistory();
  const [address, setAddress] = useState<string | null>('');
  const firstTime = useRef(true);
  const [walletName, setWalletName] = useState<WalletName>();

  const connectMetaMask = async () => {
    try {
      await connect();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('metamask connection', err);
    }
  };

  const login = async (wallet: WalletName) => {
    setLoading(true);

    switch (wallet) {
      case WalletName.METAMASK:
        await connectMetaMask();
        break;
      default:
        break;
    }
    setLoading(false);
  };

  useEffect(() => {
    setAddress(account);
    setWalletName(WalletName.METAMASK);

    if (account && !firstTime.current && history) {
      history.push(`/address/${account}`);
    }

    if (account) {
      firstTime.current = false;
    }
  }, [account, history]);

  return (
    <AuthContext.Provider value={{ address, walletName, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};
