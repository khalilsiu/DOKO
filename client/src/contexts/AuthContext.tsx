import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react';
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
import DokoRental from '../contracts/DokoRental.json';
import DecentralandAbi from '../contracts/Decentraland.json';
import { useDispatch } from 'react-redux';
import { openToast } from '../store/app';

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

interface AuthContextValue {
  address: string | null;
  loading: boolean;
  walletName?: WalletName;
  connect: () => void;
  dclContract: ethers.Contract | null;
  dokoRentalContract: ethers.Contract | null;
  approveDokoOnDcl: () => void;
  isDokoApproved: boolean;
  checkApproveForAll: (walletAddress: string) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  address: null,
  loading: false,
  connect: () => null,
  walletName: undefined,
  dclContract: null,
  dokoRentalContract: null,
  approveDokoOnDcl: () => null,
  isDokoApproved: false,
  checkApproveForAll: () => null,
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
  const [loading, setLoading] = useState(false);
  const { account, connect, status } = useMetaMask();
  const [solAccount, setSolAccount] = useState('');
  const classes = useStyles();
  const history = useHistory();
  const [address, setAddress] = useState<string | null>('');
  const firstTime = useRef(true);
  const [walletName, setWalletName] = useState<WalletName>();
  const [walletSelected, setWalletSelected] = useState<Wallet>(wallets[0]);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [dclContract, setDclContract] = useState<ethers.Contract | null>(null);
  const [dokoRentalContract, setDokoRentalContract] = useState<ethers.Contract | null>(null);
  const [isDokoApproved, setIsDokoApproved] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dokoRentalAddress = process.env.REACT_APP_DOKO_DCL_LAND_ADDRESS;
  const dclAddress = process.env.REACT_APP_DCL_LAND_ADDRESS;
  const connectDCL = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setDclContract(new Contract(dclAddress || '', DecentralandAbi, signer));
  };

  const connectDokoRental = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setDokoRentalContract(new Contract(dokoRentalAddress || '', DokoRental.abi, signer));
  };

  const approveDokoOnDcl = async () => {
    if (dclContract) {
      setLoading(true);
      const result = await dclContract.setApprovalForAll(dokoRentalAddress, true);
      setIsDokoApproved(result);
      setLoading(false);
    }
  };

  useEffect(() => {
    connectDCL();
    connectDokoRental();
  }, []);

  const checkApproveForAll = async (walletAddress: string) => {
    if (!dclContract) {
      dispatch(openToast({ message: 'DCL contract instance not instantiated', state: 'error' }));
      return;
    }
    try {
      const isApprovedForAll = await dclContract.isApprovedForAll(walletAddress, dokoRentalAddress);
      setIsDokoApproved(isApprovedForAll);
    } catch (e) {
      dispatch(openToast({ message: (e as Error).message, state: 'error' }));
      return;
    }
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

    if ((account || solAccount) && !firstTime.current && history) {
      history.push(`/address/${account || solAccount}`);
    }

    if (account || solAccount) {
      firstTime.current = false;
    }
  }, [account, solAccount, history]);

  return (
    <AuthContext.Provider
      value={{
        address,
        walletName,
        loading,
        connect: () => setShowWalletModal(true),
        dclContract,
        dokoRentalContract,
        approveDokoOnDcl,
        isDokoApproved,
        checkApproveForAll,
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
