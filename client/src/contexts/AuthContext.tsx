import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';


declare let window: any;

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
  const [account, setAccount] = useState('');
  const history = useHistory();
  const [address, setAddress] = useState<string | null>('');
  const firstTime = useRef(true);
  
  const login = async () => {
    if(!window.solana || !window.solana.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return;
    }
    setLoading(true);
    window.solana.connect();
    window.solana.on("connect", () => {
      setAccount(window.solana.publicKey.toString());
      setLoading(false);
    })
  };

  useEffect(() => {
    setAddress(account);

    if (account && !firstTime.current) {
      history && history.push(`/collections/${account}`);
    }

    if (account) {
      firstTime.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, history]);

  return (
    <AuthContext.Provider value={{ address, loading, login }}>{children}</AuthContext.Provider>
  );
};
