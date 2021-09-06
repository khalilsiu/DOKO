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
      .then(() => {
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setAddress(account);

    if (account) {
      indexAddress(account);
      history && history.push(`/collections/${account}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, history]);

  return (
    <AuthContext.Provider value={{ address, loading, login }}>{children}</AuthContext.Provider>
  );
};
