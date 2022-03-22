import {
  Typography,
  IconButton,
  makeStyles,
  Button,
  MenuItem,
  withStyles,
  Select,
  Input,
  Theme,
  useMediaQuery,
  Grid,
} from '@material-ui/core';
import UIModal from '../UIModal';
import CloseIcon from '@material-ui/icons/Close';
import { AcceptedTokens, tokens } from '../../constants/acceptedTokens';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Asset } from '../../store/summary/profileOwnershipSlice';
import { openToast, startLoading, stopLoading } from '../../store/app/appStateSlice';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import { acceptLeaseToBlockchain } from '../../store/lease/metaverseLeasesSlice';
import config from 'config';
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
  modalContentRow: { marginBottom: '0.7rem' },
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
  detailItem: {
    fontSize: '0.8rem',
    color: theme.palette.grey[400],
  },
  selectValue: {
    color: theme.palette.grey[400],
  },
  menu: {
    backgroundColor: 'black',
    maxHeight: '30vh',
  },
}));

export const StyledSelect = withStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: '15px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    '&:focus': {
      backgroundColor: 'transparent',
      borderRadius: '15px',
      borderBottom: 'none',
    },
  },
  icon: {
    color: 'white',
  },
}))(Select);

export const StyledMenuItem = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: 'black !important',
    '&:hover': {
      backgroundColor: `${theme.palette.grey[800]} !important`,
    },
  },
  gutters: {
    backgroundColor: 'black !important',
  },
  selected: {
    backgroundColor: `${theme.palette.grey[800]} !important`,
  },
}))(MenuItem);

interface ILeaseDetailModal {
  asset: Asset;
  walletAddress: string;
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

const LeaseDetailModal = memo(({ asset, walletAddress }: ILeaseDetailModal) => {
  const styles = useStyles();
  const history = useHistory();
  const {
    contracts: { USDT: usdtContract, dclLandRental: dclLandRentalContract },
    connectContract,
  } = useContext(ContractContext);
  const { isTransacting, isLoading } = useSelector((state: RootState) => state.appState);
  const [finalLeaseLength, setFinalLeaseLength] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const mdOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const dispatch = useDispatch();

  useEffect(() => {
    connectContract('USDT');
    connectContract('dclLandRental');
  }, []);

  const assetDetails = useMemo(() => {
    const details = {
      tokenLabel: 'N.A.',
      tokenSymbol: '',
      leaseAmount: 'N.A.',
      deposit: 'N.A.',
      gracePeriod: 'N.A.',
      leaseLengths: [] as number[],
    };
    if (asset.lease) {
      const { lease } = asset;
      const token = tokens.find((token) => token.symbol === lease?.rentToken);
      details.leaseAmount = lease.rentAmount.toString();
      details.deposit = lease.deposit.toString();
      details.gracePeriod = lease.gracePeriod.toString();
      setFinalLeaseLength(lease.minLeaseLength);
      details.leaseLengths = Array(lease.maxLeaseLength - lease.minLeaseLength + 1)
        .fill(null)
        .map((_, i) => i + lease.minLeaseLength);
      if (token) {
        details.tokenLabel = token.label;
        details.tokenSymbol = token.symbol;
      }
    }
    return details;
  }, [asset]);

  const requireApproval = assetDetails.tokenSymbol !== 'ETH';

  const handleSelectChange = (e) => {
    setFinalLeaseLength(e.target.value);
  };

  const purchaseLease = useCallback(async () => {
    if (!dclLandRentalContract) {
      dispatch(
        openToast({
          message: 'Land rental contract initialization error',
          state: 'error',
        }),
      );
      return;
    }
    if (asset.ownerAddress === walletAddress) {
      dispatch(
        openToast({
          message: 'Land owner cannot purchase lease of owned asset',
          state: 'error',
        }),
      );
      return;
    }

    if (!asset.lease) {
      dispatch(openToast({ message: 'Lease has not been created', state: 'error' }));
      return;
    }

    await dispatch(
      acceptLeaseToBlockchain({
        assetId: asset.tokenId,
        finalLeaseLength,
        dclLandRentalContract,
        rentAmount: asset.lease.rentAmount,
        rentToken: asset.lease.rentToken,
        deposit: asset.lease.deposit,
      }),
    );

    history.push(`/rentals`);
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
          <IconButton style={{ color: 'white' }} onClick={() => history.push(`/rentals`)}>
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
            <Grid container spacing={2} className={styles.modalContentRow} style={{ display: 'flex' }}>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Lease Token
                </Typography>
                <Typography variant="subtitle2" className={styles.detailItem}>
                  {assetDetails.tokenLabel}
                </Typography>
              </Grid>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Lease Amount
                </Typography>
                <Typography variant="subtitle2" className={styles.detailItem}>
                  {assetDetails.leaseAmount} {assetDetails.tokenSymbol} per month
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} className={styles.modalContentRow}>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Lease Length
                </Typography>
                <StyledSelect
                  value={finalLeaseLength}
                  defaultValue=""
                  variant="outlined"
                  onChange={handleSelectChange}
                  fullWidth
                  MenuProps={{ classes: { list: styles.menu } }}
                  input={<Input className={styles.underline} />}
                  style={{ height: '30px' }}
                  disabled={isTransacting || isLoading}
                >
                  {assetDetails.leaseLengths.map((leaseLength) => (
                    <StyledMenuItem key={leaseLength} value={leaseLength}>
                      <Typography variant="body2" className={styles.selectValue}>
                        {leaseLength} months
                      </Typography>
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </Grid>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Security Deposit Amount
                </Typography>
                <div
                  style={{
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" className={styles.detailItem}>
                    {assetDetails.deposit} {assetDetails.tokenSymbol}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2} className={styles.modalContentRow}>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Grace Period
                </Typography>
                <Typography variant="subtitle2" className={styles.detailItem}>
                  {assetDetails.gracePeriod} days
                </Typography>
              </Grid>
            </Grid>
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
            onClick={requireApproval && !isApproved ? approveToken : purchaseLease}
            disabled={isTransacting || isLoading || asset.ownerAddress === walletAddress}
          >
            {requireApproval && !isApproved ? 'Approve' : 'Accept Lease'}
          </Button>
        </div>
      )}
    />
  );
});

export default LeaseDetailModal;
