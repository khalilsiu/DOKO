import React from 'react';
import UIModal from 'components/UIModal';
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Wallet } from 'types';

interface Props {
  showModal: boolean;
  wallets: Wallet[];
  selectedWallet: Wallet;
  setSelectedWallet: (wallet: Wallet) => void;
  closeModal: () => void;
  login: () => void;
}

export const AuthModal = React.memo<Props>(
  ({ showModal, closeModal, wallets, selectedWallet, setSelectedWallet, login }) => {
    const classes = useStyles();

    return (
      <UIModal
        modalOpen={showModal}
        renderHeader={() => (
          <div className={classes.modalHeader}>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              Connect Wallet
            </Typography>
            <IconButton style={{ color: 'white' }} onClick={closeModal}>
              <CloseIcon fontSize="medium" />
            </IconButton>
          </div>
        )}
        renderBody={() => (
          <div className={classes.modalContent}>
            {wallets.map((wallet) => (
              <div
                className={`${classes.walletContainer} 
                ${selectedWallet.name === wallet.name && classes.walletSelected}`}
                key={wallet.label}
                onClick={() => setSelectedWallet(wallet)}
                onKeyDown={() => setSelectedWallet(wallet)}
              >
                <img src={wallet.icon} className={classes.walletImage} />

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
    );
  },
);

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
  walletSelected: {
    borderColor: theme.palette.primary.main,
  },
}));
