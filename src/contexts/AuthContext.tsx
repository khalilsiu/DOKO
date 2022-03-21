import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CloseIcon from '@material-ui/icons/Close';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
// import useTheme from '@material-ui/core/styles/useTheme';
import { ethers, Contract } from 'ethers';
import UIModal from '../components/UIModal';
import { Wallet, WalletName } from '../types';
import { useDispatch } from 'react-redux';

import { rentalContracts } from '../constants/rentals';
import { tokens } from '../constants/acceptedTokens';
import metaverses from '../constants/metaverses';
import { openToast } from 'store/app/appStateSlice';
import { injected } from 'config/injected';
import { useWeb3React } from '@web3-react/core';

declare let window: any;

type ContractNames = 'dclLandRental' | 'dclLand' | 'USDT';

type Contracts = { [key in ContractNames]: ethers.Contract | null };
export interface AuthContextType {
  connectContract: (symbol: ContractNames) => void;
  contracts: Contracts;
  isActive: boolean;
  address: string;
  connect: () => void;
  disconnect: () => Promise<void>;
}
const wallets: Wallet[] = [
  {
    icon: '/DOKO_Metamasklogo_asset.png',
    label: 'MetaMask Wallet',
    name: WalletName.METAMASK,
  },
];

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: PropsWithChildren<any>) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [address, setAddress] = useState('');
  const [walletSelected, setWalletSelected] = useState<Wallet>(wallets[0]);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const { account, active, error, activate, deactivate } = useWeb3React();
  const [isActive, setIsActive] = useState(false);

  const connect = async () => {
    try {
      await activate(injected);
    } catch (e) {
      dispatch(openToast({ message: `Error on connecting to Metamask ${e}`, state: 'error' }));
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (e) {
      dispatch(openToast({ message: `Error on disconnecting from App ${e}`, state: 'error' }));
    }
  };

  const login = useCallback(async () => {
    await connect();
    setShowWalletModal(false);
  }, []);

  // check when app is connected to metamask as
  const handleIsActive = useCallback(async () => {
    const isAuthorized = await injected.isAuthorized();
    if (isAuthorized && !active && !error) {
      await activate(injected);
    }
  }, [active, injected, error]);

  useEffect(() => {
    handleIsActive();
  }, [active, injected, error]);

  useEffect(() => {
    if (account) {
      setAddress(account.toLowerCase());
    }
  }, [account]);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  const [contracts, setContracts] = useState<Contracts>({
    dclLandRental: null,
    dclLand: null,
    USDT: null,
  });

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setSigner(signer);
  }, []);

  useEffect(() => {
    if (signer) {
      connectContract('dclLandRental');
      connectContract('dclLand');
      connectContract('USDT');
    }
  }, [signer]);

  const connectContract = (symbol: ContractNames) => {
    const metaverseContracts = metaverses.map((metaverse) => metaverse.contracts).flat();
    const contract = [...tokens, ...rentalContracts, ...metaverseContracts].find(
      (contract) => contract.symbol === symbol,
    );
    if (!contract) {
      dispatch(openToast({ message: `${contract} not found`, state: 'error' }));
      return;
    }
    if (!signer) {
      dispatch(openToast({ message: `Signer is not initialized`, state: 'error' }));
      return;
    }

    setContracts((state) => ({
      ...state,
      [symbol]: new Contract(contract.address || '', contract.abi, signer),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        address,
        connect: () => setShowWalletModal(true),
        disconnect,
        isActive,
        connectContract,
        contracts,
      }}
    >
      <>
        {children}
        <UIModal
          modalOpen={showWalletModal}
          renderHeader={() => (
            <div className={classes.modalHeader}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Connect Wallet
              </Typography>
              <IconButton style={{ color: 'white' }} onClick={() => setShowWalletModal(false)}>
                <CloseIcon fontSize="medium" />
              </IconButton>
            </div>
          )}
          renderBody={() => (
            <div className={classes.modalContent}>
              {wallets.map((wallet) => (
                <div
                  className={`${classes.walletContainer} 
                ${walletSelected.name === wallet.name && classes.walletSelected}`}
                  key={wallet.label}
                  onClick={() => setWalletSelected(wallet)}
                  onKeyDown={() => setWalletSelected(wallet)}
                >
                  <img src={wallet.icon} alt="" className={classes.walletImage} />

                  <Typography variant="subtitle2" className={classes.walletName}>
                    {wallet.label}
                  </Typography>
                </div>
              ))}
            </div>
          )}
          renderFooter={() => (
            <div className={classes.modalFooter}>
              <Button className={classes.modalButton} variant="outlined" onClick={login}>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Connect Wallet
                </Typography>
              </Button>
            </div>
          )}
        />
      </>
    </AuthContext.Provider>
  );
};

const useStyles = makeStyles((theme) => ({
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    padding: '1.5rem',
    [theme.breakpoints.down('sm')]: {
      padding: '0.5rem 1.3rem',
    },
    justifyContent: 'space-between',
  },
  modalContent: {
    display: 'flex',
    padding: '1.5rem',
  },
  walletContainer: {
    width: '8rem',
    height: '8rem',
    [theme.breakpoints.down('sm')]: {
      width: '7rem',
      height: '7rem',
    },
    padding: '1.5rem',
    border: '0.5px solid',
    borderColor: theme.palette.grey[800],
    borderRadius: '10px',
    marginRight: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  walletSelected: {
    borderColor: theme.palette.primary.main,
  },
  walletImage: {
    height: '3rem',
    width: '3rem',
    [theme.breakpoints.down('sm')]: {
      width: '2rem',
      height: '2rem',
    },
    marginBottom: '1rem',
  },
  walletName: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '5rem',
    fontSize: '0.7rem',
    lineHeight: '1.2',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1.5rem',
  },
  modalButton: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    width: '13rem',
    height: '3rem',
    [theme.breakpoints.down('sm')]: {
      width: '11rem',
      height: '2.5rem',
    },
  },
}));
