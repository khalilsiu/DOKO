import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { ethers, Contract } from 'ethers';
import UIModal from '../components/modal';
import { Wallet, WalletName } from '../types';
import DokoRentalDclLand from '../contracts/DokoRentalDclLand.json';
import DecentralandAbi from '../contracts/Decentraland.json';
import Erc20Token from '../contracts/Erc20Token.json';
import { useDispatch } from 'react-redux';
import { openToast } from '../store/app';
import { DokoRentalContract } from '../types/contracts/dokoRentalDclLand';

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

declare let window: any;

type ConnectedContract = 'dokoRentalDclLand' | 'dclLand' | 'erc20';
interface AuthContextValue {
  address?: string;
  loading: boolean;
  walletName?: WalletName;
  connect?: () => void;
  dclLandContract: ethers.Contract | null;
  dokoRentalDclLandContract: DokoRentalContract | null;
  erc20Contract: ethers.Contract | null;
}

export const AuthContext = createContext<AuthContextValue>({
  loading: false,
  dclLandContract: null,
  dokoRentalDclLandContract: null,
  erc20Contract: null,
});

export const AuthContextProvider = ({ children, nft }: PropsWithChildren<any>) => {
  let wallets: Wallet[] = [
    {
      icon: '/DOKO_Metamasklogo_asset.png',
      label: 'MetaMask Wallet',
      name: WalletName.METAMASK,
    },
  ];
  if (nft) {
    wallets = [
      {
        icon: '/DOKO_Metamasklogo_asset.png',
        label: 'MetaMask Wallet',
        name: WalletName.METAMASK,
      },
      {
        icon: '/DOKO_Phantomlogo_asset.png',
        label: 'Phantom Wallet',
        name: WalletName.PHANTOM,
      },
    ];
  }
  const { account, connect, status } = useMetaMask();
  const [solAccount, setSolAccount] = useState('');
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [walletName, setWalletName] = useState<WalletName>();
  const [walletSelected, setWalletSelected] = useState<Wallet>(wallets[0]);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const [dclLandContract, setDclLandContract] = useState<ethers.Contract | null>(null);
  const [dokoRentalDclLandContract, setDokoRentalDclLandContract] =
    useState<ethers.Contract | null>(null);
  const [erc20Contract, setErc20Contract] = useState<ethers.Contract | null>(null);

  const dokoRentalDclLandAddress = process.env.REACT_APP_DOKO_DCL_LAND_ADDRESS;
  const dclLandAddress = process.env.REACT_APP_DCL_LAND_ADDRESS;
  const erc20Address = process.env.REACT_APP_USDT_ADDRESS;

  const contracts = useMemo(
    () => ({
      dokoRentalDclLand: {
        address: dokoRentalDclLandAddress,
        abi: DokoRentalDclLand.abi,
        contract: dokoRentalDclLandContract,
        setContract: setDokoRentalDclLandContract,
      },
      dclLand: {
        address: dclLandAddress,
        abi: DecentralandAbi,
        contract: dclLandContract,
        setContract: setDclLandContract,
      },
      erc20: {
        address: erc20Address,
        abi: Erc20Token.abi,
        contract: erc20Contract,
        setContract: setErc20Contract,
      },
    }),
    [dokoRentalDclLandContract, dclLandContract, erc20Contract],
  );

  const connectContract = async (contractName: ConnectedContract) => {
    const { address, abi, setContract } = contracts[contractName];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setContract(new Contract(address || '', abi, signer));
  };

  const connectMetaMask = async () => {
    try {
      if (isMobile) {
        if (status === 'unavailable') {
          window.location.href = 'https://metamask.app.link/dapp/doko.one';
        }
        await connect();
      } else {
        await connect();
      }
    } catch (err) {
      dispatch(openToast({ message: `Metamask error ${(err as Error).message}`, state: 'error' }));
      return;
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

  const connectWallet = () => {
    setShowWalletModal(false);
    login(walletSelected.name);
  };

  useEffect(() => {
    setAddress(account || solAccount || '');
  }, [account, solAccount, history]);

  useEffect(() => {
    connectContract('dclLand');
    connectContract('dokoRentalDclLand');
    connectContract('erc20');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        address,
        walletName,
        loading,
        connect: () => setShowWalletModal(true),
        dclLandContract,
        dokoRentalDclLandContract: dokoRentalDclLandContract as DokoRentalContract,
        erc20Contract,
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
              <Button
                className={classes.modalButton}
                variant="outlined"
                onClick={() => connectWallet()}
              >
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
