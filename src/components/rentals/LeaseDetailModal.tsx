import { Typography, IconButton, makeStyles, Button, Theme, useMediaQuery } from '@material-ui/core';
import UIModal from '../UIModal';
import CloseIcon from '@material-ui/icons/Close';
import { AcceptedTokens } from '../../constants/acceptedTokens';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Asset } from '../../store/profile/profileOwnershipSlice';
import { openToast, startLoading, stopLoading } from '../../store/app/appStateSlice';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import { acceptLease, LeaseStatus, payRent } from '../../store/lease/leasesSlice';
import config from 'config';
import { getLeaseState, LeaseMode } from 'components/profile/OwnershipView';
import RenderLeaseDetails from './RenderLeaseDetails';
import { ContractContext } from 'contexts/ContractContext';

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
  modal: {
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
    width: '900px',
  },
  modalContent: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      height: '60vh',
      overflowY: 'scroll',
      marginBottom: '1.5rem',
    },
  },
  modalContentLeft: {
    flex: 1,
    borderRight: 'white 1px solid',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  assetName: { fontWeight: 'bold', paddingBottom: '0.5rem' },
  assetImage: {
    borderRadius: '10px',
    border: 'white 1px solid',
    flex: 1,
  },
  modalContentRight: { flex: 2, padding: '1.5rem' },
  errorMessage: { marginTop: '0.2rem', color: 'red', fontSize: '0.8rem' },
  underline: {
    '&:before': {
      borderBottom: 'none',
    },
    '&:after': {
      borderBottom: 'none',
    },
    '&:focus': {
      borderBottom: 'none',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
  },
  selectValue: {
    color: theme.palette.grey[400],
  },
  menu: {
    backgroundColor: 'black',
    maxHeight: '30vh',
  },
}));

interface ILeaseDetailModal {
  asset: Asset;
  walletAddress: string;
  mode: LeaseMode;
}

export interface LeaseForm {
  rentToken: AcceptedTokens;
  rentAmount: string;
  deposit: string;
  gracePeriod: string;
  minLeaseLength: string;
  maxLeaseLength: string;
  autoRegenerate: boolean;
}
const dclLandRentalAddress = config.dclLandRentalAddress;

const LeaseDetailModal = memo(({ asset, walletAddress, mode }: ILeaseDetailModal) => {
  const styles = useStyles();
  const history = useHistory();
  const {
    contracts: { USDT: usdtContract, dclLandRental: dclLandRentalContract },
  } = useContext(ContractContext);
  const { isTransacting, isLoading } = useSelector((state: RootState) => state.appState);
  const [finalLeaseLength, setFinalLeaseLength] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const mdOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const dispatch = useDispatch();
  const closePath = mode === 'lease' ? '/rentals' : `/address/${walletAddress}`;

  useEffect(() => {
    if (asset.lease) {
      setFinalLeaseLength(asset.lease.minLeaseLength);
    }
  }, [asset]);

  const leaseState = useMemo(() => {
    const state = getLeaseState(asset);
    if (state === LeaseStatus['OPEN'] || state === 'OVERDUE' || state === LeaseStatus['LEASED']) {
      return state;
    }
    return 'ERROR';
  }, [asset]);

  const isFieldDisabled = () => {
    const base = isTransacting || isLoading || walletAddress === asset.owner;

    if (mode === 'lease') {
      return base || leaseState === LeaseStatus['LEASED'];
    }

    // mode === 'rent'
    if (asset.lease && !asset.lease.isRentOverdue) {
      return base || (asset.lease && !asset.lease.isRentOverdue);
    }

    return base;
  };

  const renderButtonText = useCallback(() => {
    if (!asset.lease) {
      return 'No Lease';
    }
    const requireApproval = asset.lease.rentToken !== 'ETH';
    if (requireApproval && !isApproved) {
      return 'Approve';
    }
    if (leaseState === LeaseStatus['OPEN']) {
      return 'Accept Lease';
    }

    if (leaseState === LeaseStatus['LEASED']) {
      return 'Rent Paid';
    }

    if (leaseState === 'OVERDUE') {
      return 'Pay Rent';
    }
    return 'Error';
  }, [leaseState, isApproved, asset]);

  const handleButtonClick = useCallback(() => {
    if (!asset.lease) {
      return;
    }
    const requireApproval = asset.lease.rentToken !== 'ETH';
    if (requireApproval && !isApproved) {
      return approveToken();
    }
    if (leaseState === LeaseStatus['OPEN']) {
      return handleAcceptLease();
    }
    if (leaseState === 'OVERDUE') {
      return handlePayRent();
    }
  }, [leaseState, isApproved, asset]);

  const handleLeaseLengthSelect = (e) => {
    setFinalLeaseLength(e.target.value);
  };

  const handleAcceptLease = useCallback(async () => {
    await dispatch(
      acceptLease({
        finalLeaseLength,
        dclLandRentalContract,
        operator: walletAddress,
      }),
    );

    history.push(closePath);
  }, [asset, dclLandRentalContract, walletAddress, finalLeaseLength]);

  const handlePayRent = useCallback(async () => {
    await dispatch(
      payRent({
        dclLandRentalContract,
        operator: walletAddress,
      }),
    );

    history.push(closePath);
  }, [asset, dclLandRentalContract, walletAddress, finalLeaseLength]);

  const approveToken = useCallback(async () => {
    dispatch(startLoading());
    if (!usdtContract) {
      dispatch(
        openToast({
          message: 'Decentraland contract initialization error',
          state: 'error',
        }),
      );
      return;
    }
    try {
      const txn = await usdtContract.approve(dclLandRentalAddress || '', ethers.constants.MaxUint256);
      const receipt = await txn.wait();
      // wait for approve to resolve
      setIsApproved(receipt);
    } catch (e) {
      dispatch(openToast({ message: (e as Error).message, state: 'error' }));
    }
    dispatch(stopLoading());
  }, [usdtContract, dclLandRentalAddress]);

  useEffect(() => {
    (async () => {
      if (usdtContract) {
        try {
          dispatch(startLoading());
          const tokensApproved = await usdtContract.allowance(walletAddress, dclLandRentalAddress || '');
          // Returns number of token being approved, 0 is unapproved
          setIsApproved(tokensApproved.gt(0));
        } catch (e) {
          dispatch(openToast({ message: (e as Error).message, state: 'error' }));
        }
        dispatch(stopLoading());
      }
    })();
  }, [usdtContract]);

  return (
    <UIModal
      klasses={styles.modal}
      modalOpen={!!asset}
      renderHeader={() => (
        <div className={styles.modalHeader}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            Lease Details
          </Typography>
          <IconButton style={{ color: 'white' }} onClick={() => history.push(closePath)}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </div>
      )}
      renderBody={() => (
        <div className={styles.modalContent}>
          {mdOrAbove && (
            <div className={styles.modalContentLeft}>
              <Typography variant="body2" className={styles.assetName}>
                {asset.name}
              </Typography>
              <div
                className={styles.assetImage}
                style={{
                  backgroundImage: `url('${asset.imageOriginalUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
            </div>
          )}
          <div className={styles.modalContentRight}>
            <RenderLeaseDetails
              lease={asset.lease}
              finalLeaseLength={finalLeaseLength}
              handleLeaseLengthSelect={handleLeaseLengthSelect}
              mode={mode}
            />
            <div>
              <Typography variant="body2" style={{ paddingBottom: '0.25rem', fontSize: '0.8rem' }}>
                Notes:
              </Typography>
              <Typography variant="body2" style={{ fontSize: '0.75rem' }}>
                All fees are sent directly to the address creating the lease so there is no need for you to claim.
              </Typography>
              <Typography variant="body2" style={{ fontSize: '0.75rem' }}>
                The smart contract is audited by PeckShield. However use at your own risk.
              </Typography>
            </div>
          </div>
        </div>
      )}
      renderFooter={() => (
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            className="gradient-button"
            variant="contained"
            style={{ marginRight: '0.5rem', minWidth: '150px' }}
            onClick={handleButtonClick}
            disabled={isFieldDisabled()}
          >
            {renderButtonText()}
          </Button>
        </div>
      )}
    />
  );
});

export default LeaseDetailModal;
