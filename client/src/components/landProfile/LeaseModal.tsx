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
import { useCallback, useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import Joi from 'joi';
import { AuthContext } from '../../contexts/AuthContext';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { upsertLeaseToBlockchain } from '../../store/lease/leasesSlice';
import { RootState } from '../../store/store';
import { Asset } from '../../store/summary/profileOwnershipSlice';
import { parseError } from '../../utils/joiErrors';
import { openToast } from '../../store/app/appStateSlice';
import { useHistory } from 'react-router-dom';
import { useAssetSliceSelector } from 'store/asset/assetSlice';

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
}));

export const StyledSelect = withStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    padding: '0 0 0 10px',
    backgroundColor: 'white',
    borderRadius: '15px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    '&:focus': {
      backgroundColor: 'white',
      borderRadius: '15px',
      borderBottom: 'none',
    },
  },
})(Select);

interface ILeaseModal {
  setSelectedAssetForLease?: (asset: Asset | null) => void;
  walletAddress: string;
  addressConcerned: string;
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

const schema = {
  rentToken: Joi.string()
    .valid(...tokens.map((token) => token.symbol))
    .required(),
  rentAmount: Joi.number().positive().required(),
  deposit: Joi.number().positive().required(),
  gracePeriod: Joi.number().positive().min(7).integer().required(),
  minLeaseLength: Joi.number().min(1).integer().required(),
  maxLeaseLength: Joi.number().when('minLeaseLength', {
    is: Joi.exist(),
    then: Joi.number().greater(Joi.ref('minLeaseLength')).integer().required(),
  }),
  autoRegenerate: Joi.bool().required(),
};

const LeaseModal = memo(({ addressConcerned, walletAddress }: ILeaseModal) => {
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
  const mdOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const asset = useAssetSliceSelector((state) => state.asset);
  const initialState = {
    rentToken: AcceptedTokens['ETH'],
    rentAmount: '',
    deposit: '',
    gracePeriod: '',
    minLeaseLength: '',
    maxLeaseLength: '',
    autoRegenerate: false,
  };

  const [leaseForm, setLeaseForm] = useState<LeaseForm>(initialState);

  useEffect(() => {
    if (asset && asset.lease) {
      setLeaseForm({
        rentToken: asset.lease?.rentToken,
        rentAmount: (asset.lease?.rentAmount).toString(),
        deposit: (asset.lease?.deposit).toString(),
        gracePeriod: (asset.lease?.gracePeriod).toString(),
        minLeaseLength: (asset.lease?.minLeaseLength).toString(),
        maxLeaseLength: (asset.lease?.maxLeaseLength).toString(),
        autoRegenerate: asset.lease?.autoRegenerate,
      });
    }
  }, [asset, asset.lease]);

  const [errors, setErrors] = useState<{ [key in keyof LeaseForm]: string }>({
    rentToken: '',
    rentAmount: '',
    deposit: '',
    gracePeriod: '',
    minLeaseLength: '',
    maxLeaseLength: '',
    autoRegenerate: '',
  });

  useEffect(() => {
    checkApproveForAll(walletAddress);
  }, [dclContract]);

  const approveLease = async () => {
    if (!dclContract || walletAddress !== addressConcerned) {
      dispatch(openToast({ message: 'Decentraland contract instance error', state: 'error' }));
      return;
    }
    await approveDokoOnDcl();
  };

  const upsertLease = async () => {
    const result = Joi.object(schema).validate(leaseForm);
    if (result.error) {
      const newErrors = cloneDeep(errors);
      newErrors[result.error.details[0].path[0]] = parseError(result.error);
      setErrors(newErrors);
      return;
    }

    if (!dokoRentalContract || walletAddress !== addressConcerned) {
      dispatch(openToast({ message: 'Doko contract instance error', state: 'error' }));
      return;
    }

    await dispatch(
      upsertLeaseToBlockchain({
        leaseForm,
        walletAddress,
        assetId: asset.tokenId,
        dokoRentalContract,
        isUpdate: !!asset.lease,
      }),
    );

    history.push(`/address/${addressConcerned}`);
  };

  const handleChange = useCallback(
    (e) => {
      const newLeaseForm = cloneDeep(leaseForm);
      newLeaseForm.rentToken = e.target.value;
      setLeaseForm(newLeaseForm);
    },
    [leaseForm],
  );

  const handleCheck = useCallback(() => {
    const newLeaseForm = cloneDeep(leaseForm);
    newLeaseForm.autoRegenerate = !newLeaseForm.autoRegenerate;
    setLeaseForm(newLeaseForm);
  }, [leaseForm]);

  const handleBlur = (e) => {
    const rawValue = e.target.value;
    const targetName = e.target.name;
    const input = { [targetName]: parseFloat(rawValue) };
    const result = Joi.object({ [targetName]: schema[targetName] }).validate(input);
    if (result.error) {
      const newErrors = cloneDeep(errors);
      newErrors[targetName] = parseError(result.error);
      setErrors(newErrors);
      return;
    }
    const newErrors = cloneDeep(errors);
    newErrors[targetName] = '';
    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    const targetName = e.target.name;
    const newLeaseForm = cloneDeep(leaseForm);
    newLeaseForm[targetName] = rawValue || '';
    setLeaseForm(newLeaseForm);
  };

  return (
    <UIModal
      klasses={styles.modal}
      modalOpen={!!asset}
      renderHeader={() => (
        <div className={styles.modalHeader}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            Create Lease
          </Typography>
          <IconButton
            style={{ color: 'white' }}
            onClick={() => history.push(`/address/${addressConcerned}`)}
          >
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
                  Fee Token
                </Typography>
                <StyledSelect
                  value={leaseForm.rentToken}
                  variant="filled"
                  fullWidth
                  onChange={handleChange}
                  input={<Input className={styles.underline} />}
                  style={{ height: '30px' }}
                  disabled={isTransacting || approveLoading || isLoading}
                >
                  {tokens.map((token) => (
                    <MenuItem key={token.symbol} value={token.symbol}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: '0.5rem',
                          }}
                        >
                          <img src={token.icon} alt="" height="20px" />
                        </div>
                        {token.label}
                      </div>
                    </MenuItem>
                  ))}
                </StyledSelect>
              </Grid>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Fee Per Month
                </Typography>
                <RadiusInput
                  fullWidth
                  placeholder={`Monthly rent in ${leaseForm.rentToken}`}
                  style={{ height: '30px' }}
                  name="rentAmount"
                  onChange={handleInputChange}
                  disabled={isTransacting || approveLoading || isLoading}
                  onBlur={handleBlur}
                  value={leaseForm.rentAmount}
                />
                {errors.rentAmount && (
                  <Typography variant="body2" className={styles.errorMessage}>
                    {errors.rentAmount}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} className={styles.modalContentRow}>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Min. Lease Length
                </Typography>
                <RadiusInput
                  fullWidth
                  placeholder="Min."
                  name="minLeaseLength"
                  style={{ height: '30px' }}
                  onChange={handleInputChange}
                  disabled={isTransacting || approveLoading || isLoading}
                  onBlur={handleBlur}
                  value={leaseForm.minLeaseLength}
                />
                {errors.minLeaseLength && (
                  <Typography variant="body2" className={styles.errorMessage}>
                    {errors.minLeaseLength}
                  </Typography>
                )}
              </Grid>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Max. Lease Length
                </Typography>
                <RadiusInput
                  fullWidth
                  placeholder="Max."
                  style={{ height: '30px' }}
                  name="maxLeaseLength"
                  onChange={handleInputChange}
                  disabled={isTransacting || approveLoading || isLoading}
                  onBlur={handleBlur}
                  value={leaseForm.maxLeaseLength}
                />
                {errors.maxLeaseLength && (
                  <Typography variant="body2" className={styles.errorMessage}>
                    {errors.maxLeaseLength}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              className={styles.modalContentRow}
              style={{ display: 'flex' }}
            >
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Security Deposit
                </Typography>
                <RadiusInput
                  fullWidth
                  style={{ height: '30px' }}
                  name="deposit"
                  placeholder={`Deposit in ${leaseForm.rentToken}`}
                  onChange={handleInputChange}
                  disabled={isTransacting || approveLoading || isLoading}
                  onBlur={handleBlur}
                  value={leaseForm.deposit}
                />
                {errors.deposit && (
                  <Typography variant="body2" className={styles.errorMessage}>
                    {errors.deposit}
                  </Typography>
                )}
              </Grid>
              <Grid sm={12} md={6} item style={{ width: '100%' }}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Grace Period for Late Fees
                </Typography>
                <RadiusInput
                  fullWidth
                  placeholder="Late rent allowed (in days)"
                  name="gracePeriod"
                  style={{ height: '30px' }}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  disabled={isTransacting || approveLoading || isLoading}
                  value={leaseForm.gracePeriod}
                />
                {errors.gracePeriod && (
                  <Typography variant="body2" className={styles.errorMessage}>
                    {errors.gracePeriod}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <div className={styles.modalContentRow}>
              <Typography variant="body2" style={{ fontWeight: 'bold', paddingBottom: '0.25rem' }}>
                Regenerate Lease
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  indeterminate={false}
                  checked={leaseForm.autoRegenerate}
                  onChange={handleCheck}
                  style={{ padding: '0 0.5rem 0 0', color: theme.palette.primary.main }}
                  disabled={isTransacting || approveLoading || isLoading}
                  value={leaseForm.autoRegenerate}
                />
                <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                  When the renter terminates the lease early, allow DOKO to list the same lease back
                  onto the market.
                </Typography>
              </div>
            </div>
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
            onClick={!isDokoApproved ? approveLease : upsertLease}
            disabled={isTransacting || approveLoading || isLoading}
          >
            {!isDokoApproved ? 'Approve' : !asset.lease ? 'Create' : 'Update'}
          </Button>
        </div>
      )}
    />
  );
});

export default LeaseModal;
