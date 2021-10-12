import { useMetaMask } from 'metamask-react';
import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { WalletName } from '../types';

declare let window: any;

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
  const [solAccount, setSolAccount] = useState('');

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

  const connectPhantom = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    try {
      await window.solana.connect();
      setSolAccount(window.solana.publicKey.toString());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('phantom connection', err);
    }
  };

  const login = async (wallet: WalletName) => {
    setLoading(true);

    switch (wallet) {
      case WalletName.METAMASK:
        setWalletName(WalletName.METAMASK);
        await connectMetaMask();
        break;
      case WalletName.PHANTOM:
        setWalletName(WalletName.PHANTOM);
        await connectPhantom();
        break;
      default:
        break;
    }
    setLoading(false);
  };

  useEffect(() => {
    setAddress(account || solAccount || '');

    if ((account || solAccount) && !firstTime.current && history) {
      history.push(`/address/${account || solAccount}`);
    }

    if (account || solAccount) {
      firstTime.current = false;
    }
  }, [account, solAccount, history]);

  return (
    <AuthContext.Provider value={{ address, walletName, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};
