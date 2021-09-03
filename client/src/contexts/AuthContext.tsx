import { useMetaMask } from 'metamask-react';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { indexAddress } from '../modules/api';

interface AuthContextValue {
  address: string | null;
  loading: boolean;
  login: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  address: null,
  loading: false,
  login: () => null
});

export const AuthContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [loading, setLoading] = useState(false);
  const { account, connect } = useMetaMask();
  const history = useHistory();
  const [address, setAddress] = useState<string | null>('');

  const login = async () => {
    setLoading(true);

    connect()
      .then(accounts => {
        setLoading(false);
        accounts?.length && history.push(`/collections/${accounts[0] as string}`);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setAddress(account);

    if (account) {
      indexAddress(account);
    }
  }, [account]);

  return (
    <AuthContext.Provider value={{ address, loading, login }}>{children}</AuthContext.Provider>
  );
};
