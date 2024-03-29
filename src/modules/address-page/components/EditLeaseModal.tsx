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
  CircularProgress,
} from '@material-ui/core';

import UIModal from '../../../components/UIModal';
import CloseIcon from '@material-ui/icons/Close';
import { AcceptedTokens, tokens } from '../../../constants/acceptedTokens';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { capitalize, cloneDeep } from 'lodash';
import Joi from 'joi';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LeaseStatus, upsertLease } from '../../../store/lease/leasesSlice';
import { RootState } from '../../../store/store';
import { Asset } from '../../../store/profile/profileOwnershipSlice';
import { parseError } from '../../../utils/joiErrors';
import { openToast, startLoading, stopLoading } from '../../../store/app/appStateSlice';
import { useHistory } from 'react-router-dom';

import { EditLeaseSchema } from './schema';
import RadiusInput from 'components/RadiusInput';
import config from 'config';
import { getLeaseState } from 'components/profile/OwnershipView';
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
  walletAddress: string;
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

interface TransformedLeaseForm {
  rentToken: AcceptedTokens;
  rentAmount: string;
  deposit: string;
  gracePeriod: number;
  minLeaseLength: number;
  maxLeaseLength: number;
  autoRegenerate: boolean;
}

const dclLandRentalAddress = config.dclLandRentalAddress;

const EditLeaseModal = memo(({ walletAddress, asset }: ILeaseModal) => {
  const styles = useStyles();
  const history = useHistory();
  const {
    contracts: { dclLandRental: dclLandRentalContract, dclLand: dclLandContract },
  } = useContext(ContractContext);
  const { isTransacting, isLoading: isAppLoading } = useSelector((state: RootState) => state.appState);
  const theme = useTheme();
  const dispatch = useDispatch();
  const mdOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const [isApproved, setIsApproved] = useState(false);
  const [isCheckingApproved, setCheckingApproved] = useState(false);

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

  const leaseState = useMemo(() => getLeaseState(asset), [asset]);

  const isFieldDisabled =
    isTransacting ||
    isAppLoading ||
    leaseState === 'OVERDUE' ||
    leaseState === LeaseStatus['LEASED'] ||
    walletAddress !== asset.owner ||
    isCheckingApproved;

  const isLoading = isAppLoading || isCheckingApproved;

  const renderButtonText = useCallback(() => {
    if (!isApproved) {
      return 'Approve';
    }
    if (leaseState === 'TOBECREATED' || leaseState === LeaseStatus['COMPLETED']) {
      return 'Create';
    }
    if (leaseState === LeaseStatus['OPEN']) {
      return 'Update';
    }
    if (leaseState === LeaseStatus['LEASED']) {
      return 'Leased';
    }
  }, [isApproved, leaseState]);

  const renderHeaderText = useCallback(() => {
    if (leaseState === 'TOBECREATED' || leaseState === LeaseStatus['COMPLETED']) {
      return 'Create Lease';
    }
    if (leaseState === LeaseStatus['OPEN']) {
      return 'Update Lease';
    }
    if (leaseState === LeaseStatus['LEASED']) {
      return 'Lease Details';
    }
  }, [isApproved, leaseState]);

  const convertLeaseFrom = (leaseForm: LeaseForm): TransformedLeaseForm => {
    const { rentAmount, deposit, gracePeriod, minLeaseLength, maxLeaseLength } = leaseForm;
    return {
      ...leaseForm,
      rentAmount,
      deposit,
      gracePeriod: parseInt(gracePeriod, 10),
      minLeaseLength: parseInt(minLeaseLength, 10),
      maxLeaseLength: parseInt(maxLeaseLength, 10),
    };
  };

  const initialErrors: Record<keyof LeaseForm, string> = useMemo(
    () => ({
      rentToken: '',
      rentAmount: '',
      deposit: '',
      gracePeriod: '',
      minLeaseLength: '',
      maxLeaseLength: '',
      autoRegenerate: '',
    }),
    [],
  );

  const [errors, setErrors] = useState<{ [key in keyof LeaseForm]: string }>(initialErrors);

  const handleAPIError = useCallback(
    (e: any) => {
      if (e.reason === 'underlying network changed') {
        const { detectedNetwork } = e;
        dispatch(
          openToast({
            message: `The blockchain network has been changed unexpectedly. Current network is: ${capitalize(
              detectedNetwork?.name,
            )} (ENS Address: ${detectedNetwork?.ensAddress})`,
            state: 'error',
          }),
        );
      } else {
        dispatch(openToast({ message: (e as Error).message, state: 'error' }));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (asset && asset.lease && leaseState !== LeaseStatus['COMPLETED']) {
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
  }, [asset, asset.lease, leaseState]);

  useEffect(() => {
    (async () => {
      if (dclLandContract) {
        try {
          setCheckingApproved(true);
          const isApproved = await dclLandContract.isApprovedForAll(walletAddress, dclLandRentalAddress || '');
          setIsApproved(isApproved);
        } catch (e) {
          handleAPIError(e);
        }
        setCheckingApproved(false);
      }
    })();
  }, [dclLandContract, walletAddress, dclLandRentalAddress, handleAPIError]);

  // can be moved into hooks
  const handleApproveLease = useCallback(async () => {
    dispatch(startLoading());
    if (!dclLandContract) {
      dispatch(
        openToast({
          message: 'Decentraland contract initialization error',
          state: 'error',
        }),
      );
      return;
    }
    try {
      const txn = await dclLandContract.setApprovalForAll(dclLandRentalAddress || '', true);
      const receipt = await txn.wait();
      setIsApproved(!!receipt);
    } catch (e: any) {
      handleAPIError(e);
    }
    dispatch(stopLoading());
  }, [dclLandContract, dclLandRentalAddress, handleAPIError]);

  const extractValidationErrors = useCallback(
    (error: Joi.ValidationError) => {
      const newErrors = cloneDeep(initialErrors);

      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = parseError({
          ...error,
          details: [detail],
        });
      });

      return newErrors;
    },
    [errors, initialErrors],
  );

  const validateForm = useCallback(() => {
    const result = Joi.object(EditLeaseSchema).validate(convertLeaseFrom(leaseForm), {
      convert: false,
      abortEarly: false,
    });

    if (result.error) {
      setErrors(extractValidationErrors(result.error));
      return false;
    } else {
      setErrors(initialErrors);
    }

    return true;
  }, [leaseForm, initialErrors]);

  const handleUpsertLease = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    await dispatch(
      upsertLease({
        leaseForm,
        operator: walletAddress,
        dclLandRentalContract,
        isUpdate: !!asset.lease,
      }),
    );

    history.push(`/address/${asset.owner}`);
  }, [leaseForm, walletAddress, asset, dclLandRentalContract, validateForm]);

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

  const handleBlur = useCallback(
    (e) => {
      if (!e) {
        return;
      }

      validateForm();
    },
    [errors, leaseForm, initialErrors, validateForm],
  );

  const handleInputChange = useCallback(
    (e) => {
      const rawValue = e.target.value;
      const targetName = e.target.name;
      const newLeaseForm = cloneDeep(leaseForm);
      newLeaseForm[targetName] = rawValue || '';
      setLeaseForm(newLeaseForm);
    },
    [leaseForm],
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isApproved) {
        handleUpsertLease();
      } else {
        handleApproveLease();
      }
    },
    [isApproved, handleUpsertLease, handleApproveLease],
  );

  return (
    <UIModal
      klasses={styles.modal}
      modalOpen={!!asset}
      renderHeader={() => (
        <div className={styles.modalHeader}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            {isLoading ? 'Loading...' : renderHeaderText()}
          </Typography>
          <IconButton style={{ color: 'white' }} onClick={() => history.push(`/address/${asset.owner}`)}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </div>
      )}
      renderBody={() => (
        <form id="editLeaseForm" onSubmit={handleSubmit}>
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
                    Fee Token
                  </Typography>
                  <StyledSelect
                    value={leaseForm.rentToken}
                    variant="filled"
                    fullWidth
                    onChange={handleChange}
                    input={<Input className={styles.underline} />}
                    style={{ height: '30px' }}
                    disabled={isFieldDisabled}
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
                    disabled={isFieldDisabled}
                    onBlur={handleBlur}
                    value={leaseForm.rentAmount}
                    type="number"
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
                    disabled={isFieldDisabled}
                    onBlur={handleBlur}
                    value={leaseForm.minLeaseLength}
                    type="number"
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
                    disabled={isFieldDisabled}
                    onBlur={handleBlur}
                    value={leaseForm.maxLeaseLength}
                    type="number"
                  />
                  {errors.maxLeaseLength && (
                    <Typography variant="body2" className={styles.errorMessage}>
                      {errors.maxLeaseLength}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2} className={styles.modalContentRow} style={{ display: 'flex' }}>
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
                    disabled={isFieldDisabled}
                    onBlur={handleBlur}
                    value={leaseForm.deposit}
                    type="number"
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
                    disabled={isFieldDisabled}
                    value={leaseForm.gracePeriod}
                    type="number"
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
                    style={{
                      padding: '0 0.5rem 0 0',
                      color: theme.palette.primary.main,
                    }}
                    disabled={isFieldDisabled}
                    value={leaseForm.autoRegenerate}
                  />
                  <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                    When the renter terminates the lease early, allow DOKO to list the same lease back onto the market.
                  </Typography>
                </div>
              </div>
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
        </form>
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
            form="editLeaseForm"
            type="submit"
            className="gradient-button"
            variant="contained"
            style={{ marginRight: '0.5rem', width: '110px' }}
            disabled={isFieldDisabled}
          >
            {isLoading ? <CircularProgress size={18} /> : renderButtonText()}
          </Button>
        </div>
      )}
    />
  );
});

export default EditLeaseModal;
