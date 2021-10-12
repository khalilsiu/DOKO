import { useMetaMask } from 'metamask-react';
import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

declare let window: any;

interface AuthContextValue {
  address: string | null;
  loading: boolean;
  login: (walletSelected: number) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  address: null,
  loading: false,
  login: (walletSelected: number) => null,
});

export const AuthContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [loading, setLoading] = useState(false);
  const { account, connect } = useMetaMask();
  const [solAccount, setSolAccount] = useState('');

  const history = useHistory();
  const [address, setAddress] = useState<string | null>('');
  const [walletType, setWalletType] = useState(0);
  const firstTime = useRef(true);

  const login = async (walletSelected: number) => {
    setWalletType(walletSelected);
    if (walletSelected === 0) {
      setLoading(true);
      connect()
        .then(() => {
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (walletSelected === 1) {
      if (!window.solana || !window.solana.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        return;
      }
      setLoading(true);
      window.solana.connect();
      window.solana.on('connect', () => {
        setSolAccount(window.solana.publicKey.toString());
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (walletType === 0) {
      setAddress(account);
    } else if (walletType === 1) {
      setAddress(solAccount);
    }

    if (account && !firstTime.current && history) {
      history.push(`/address/${account}`);
    }

    if (account) {
      firstTime.current = false;
    }
  }, [account, solAccount, history]);

  return (
    <AuthContext.Provider value={{ address, loading, login }}>{children}</AuthContext.Provider>
  );
};
