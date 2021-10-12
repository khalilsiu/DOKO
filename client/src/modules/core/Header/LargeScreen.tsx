import {
  FormControl,
  Grid,
  InputAdornment,
  Typography,
  makeStyles,
  Theme,
  Button,
  IconButton,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';
import { RadiusInput } from '../../../components';
import { HeaderUserButton } from './HeaderUserButton';
import { ToolbarItemsProps } from './types';
import UIModal from '../../../components/modal';

const useStyles = makeStyles((theme: Theme) => ({
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    padding: '1.5rem',
    justifyContent: 'space-between',
  },
  modalContent: {
    display: 'flex',
    padding: '1.5rem',
  },
  walletContainer: {
    width: '8rem',
    height: '8rem',
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
  walletImage: { height: '3rem', width: '3rem', marginBottom: '1rem' },
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
  },
}));

const wallets = [
  {
    icon: '/DOKO_Metamasklogo_asset.png',
    label: 'MetaMask Wallet',
  },
  {
    icon: '/DOKO_Phantomlogo_asset.png',
    label: 'Phantom Wallet',
  },
];

export const LargeScreen = ({ setSearch, search, loading, address, login }: ToolbarItemsProps) => {
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const classes = useStyles();
  const [walletSelected, setWalletSelected] = useState(0);

  const handleWalletClick = (index: number) => {
    setWalletSelected(index);
  };

  const selectWallet = () => {
    setModalOpen(false);
    login(walletSelected);
    console.log('select');
    console.log(walletSelected);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid xs={4} item>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="/DOKO_Lockup.png" height={36} alt="" />
          </Link>
        </Grid>
        <Grid item>
          <FormControl>
            <RadiusInput
              style={{ minWidth: 300 }}
              placeholder="Search by Address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => search && e.key === 'Enter' && history.push(`/collections/${search}`)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={4} item>
          <Grid container justifyContent="flex-end" alignItems="center">
            <Grid item>
              <a
                style={{ textDecoration: 'none', display: 'block' }}
                className="hover-button"
                href="https://doko-one.gitbook.io/doko/"
                target="_blank"
                rel="noreferrer"
              >
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  About DOKO
                </Typography>
              </a>
            </Grid>
            <Grid item style={{ marginLeft: 36 }}>
              <HeaderUserButton
                loading={loading}
                address={address}
                setModalOpen={setModalOpen}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <UIModal
        modalOpen={modalOpen}
        renderHeader={() => (
          <div className={classes.modalHeader}>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              Connect Wallet
            </Typography>
            <IconButton style={{ color: 'white' }} onClick={() => setModalOpen(false)}>
              <CloseIcon fontSize="medium" />
            </IconButton>
          </div>
        )}
        renderBody={() => (
          <div className={classes.modalContent}>
            {wallets.map((wallet, i) => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <div
                className={`${classes.walletContainer} 
                ${walletSelected === i && classes.walletSelected
                  }`}
                key={wallet.label}
                onClick={() => handleWalletClick(i)}
                onKeyDown={() => handleWalletClick(i)}
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
              onClick={() => selectWallet()}
            >
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Connect Wallet
              </Typography>
            </Button>
          </div>
        )}
      />
    </>
  );
};

export default LargeScreen;
