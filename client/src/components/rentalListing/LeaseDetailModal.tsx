import {
  Typography,
  IconButton,
  makeStyles,
  Checkbox,
  Button,
  MenuItem,
  withStyles,
  Select,
  Input,
  useTheme,
  Theme,
  useMediaQuery,
  Grid,
} from '@material-ui/core';
import { RadiusInput } from '..';
import UIModal from '../modal';
import CloseIcon from '@material-ui/icons/Close';
import { AcceptedTokens, tokens } from '../../constants/acceptedTokens';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cloneDeep } from 'lodash';
import Joi from 'joi';
import { AuthContext } from '../../contexts/AuthContext';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Asset } from '../../store/summary/profileOwnershipSlice';
import { parseError } from '../../utils/joiErrors';
import { openToast } from '../../store/app/appStateSlice';
import { useHistory } from 'react-router-dom';

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
    height: '30vh',
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

interface IEditLeaseModal {
  asset: Asset;
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

const EditLeaseModal = memo(({ asset }: IEditLeaseModal) => {
  const styles = useStyles();
  const history = useHistory();
  const {
    dclContract,
    dokoRentalContract,
    approveDokoOnDcl,
    checkApproveForAll,
    isDokoApproved,
    loading: approveLoading,
  } = useContext(AuthContext);
  const { isTransacting, isLoading } = useSelector((state: RootState) => state.appState);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [leaseLength, setLeaseLength] = useState(0);
  const mdOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const assetDetails = useMemo(() => {
    const details = {
      tokenLabel: 'N.A.',
      token: '',
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
      setLeaseLength(lease.minLeaseLength);
      details.leaseLengths = Array(100 - lease.minLeaseLength + 1)
        .fill(null)
        .map((_, i) => i + lease.minLeaseLength);
      if (token) {
        details.tokenLabel = token.label;
        details.token = token.symbol;
      }
    }
    return details;
  }, [asset]);

  const handleSelectChange = (e) => {
    setLeaseLength(e.target.value);
  };

  const approveLease = async () => {
    if (!dclContract) {
      dispatch(openToast({ message: 'Decentraland contract instance error', state: 'error' }));
      return;
    }
    await approveDokoOnDcl();
  };

  const purchaseLease = async () => {
    history.push(`/address/`);
  };

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
            <Grid
              container
              spacing={2}
              className={styles.modalContentRow}
              style={{ display: 'flex' }}
            >
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
                  {assetDetails.leaseAmount} {assetDetails.token} per month
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} className={styles.modalContentRow}>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Lease Length
                </Typography>
                <StyledSelect
                  value={leaseLength}
                  variant="outlined"
                  onChange={handleSelectChange}
                  fullWidth
                  MenuProps={{ classes: { list: styles.menu } }}
                  input={<Input className={styles.underline} />}
                  style={{ height: '30px' }}
                  disabled={isTransacting || approveLoading || isLoading}
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
                <div style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle2" className={styles.detailItem}>
                    {assetDetails.deposit} {assetDetails.token}
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
                All fees are sent directly to the address creating the lease so there is no need for
                you to claim.
              </Typography>
              <Typography variant="body2" style={{ fontSize: '0.75rem' }}>
                The smart contract is audited by PeckShield. However use at your own risk.
              </Typography>
            </div>
          </div>
        </div>
      )}
      renderFooter={() => (
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className="gradient-button"
            variant="contained"
            style={{ marginRight: '0.5rem', width: '110px' }}
            onClick={!isDokoApproved ? approveLease : purchaseLease}
            // disabled={isTransacting || approveLoading || isLoading}
          >
            {!isDokoApproved ? 'Approve' : 'Purchase Lease'}
          </Button>
        </div>
      )}
    />
  );
});

export default EditLeaseModal;
