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
} from '@material-ui/core';
import { RadiusInput } from '..';
import UIModal from '../modal';
import { AssetForLease } from './OwnershipView';
import CloseIcon from '@material-ui/icons/Close';
import { AcceptedTokens, tokens } from '../../constants/acceptedTokens';
import { useCallback, useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import Joi from 'joi';
import { camelToText } from '../../utils/utils';
import { AuthContext } from '../../contexts/AuthContext';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLeaseToBlockchain, getLease } from '../../store/lease/leaseSlice';
import { RootState } from '../../store/store';

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
    width: '900px',
  },
  modalContent: {
    display: 'flex',
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
  selectedAssetForLease: AssetForLease;
  setSelectedAssetForLease?: (nftInfo: AssetForLease | null) => void;
  walletAddress: string;
  addressConcerned: string;
}

export interface LeaseForm {
  rentToken: AcceptedTokens;
  rentAmount: number;
  deposit: number;
  gracePeriod: number;
  minLeaseLength: number;
  maxLeaseLength: number;
  autoRegenerate: boolean;
}

const schema = {
  rentToken: Joi.string()
    .valid(...tokens.map((token) => token.symbol))
    .required(),
  rentAmount: Joi.number().min(0).required(),
  deposit: Joi.number().min(0).required(),
  gracePeriod: Joi.number().min(0).required(),
  minLeaseLength: Joi.number().min(1).required(),
  maxLeaseLength: Joi.number().when('minLeaseLength', {
    is: Joi.exist(),
    then: Joi.number().greater(Joi.ref('minLeaseLength')).required(),
  }),
  autoRegenerate: Joi.bool().required(),
};

const LeaseModal = memo(
  ({
    selectedAssetForLease,
    setSelectedAssetForLease,
    addressConcerned,
    walletAddress,
  }: ILeaseModal) => {
    const styles = useStyles();
    const {
      dclContract,
      dokoRentalContract,
      approveDokoOnDcl,
      checkApproveForAll,
      isDokoApproved,
      loading: approveLoading,
    } = useContext(AuthContext);
    const { isTransacting } = useSelector((state: RootState) => state.appState);

    const theme = useTheme();
    const dispatch = useDispatch();
    const [leaseForm, setLeaseForm] = useState<LeaseForm>({
      rentToken: AcceptedTokens['ETH'],
      rentAmount: 20,
      deposit: 0,
      gracePeriod: 0,
      minLeaseLength: 0,
      maxLeaseLength: 0,
      autoRegenerate: false,
    });
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

    console.log('leaseform', leaseForm);
    const approveLease = async () => {
      if (!dclContract || walletAddress !== addressConcerned) {
        console.log('somethings wrong');
        return;
      }
      await approveDokoOnDcl();
    };

    const createLease = async () => {
      const result = Joi.object(schema).validate(leaseForm);
      if (result.error) {
        const newErrors = cloneDeep(errors);
        newErrors[result.error.details[0].path[0]] = parseError(result.error);
        setErrors(newErrors);
        return;
      }
      if (!dokoRentalContract || walletAddress !== addressConcerned) {
        console.log('somethings wrong');
        return;
      }

      await dispatch(
        createLeaseToBlockchain({
          leaseForm,
          walletAddress,
          asset: selectedAssetForLease,
          dokoRentalContract,
        }),
      );
      await dispatch(
        getLease({
          walletAddress,
          contractAddress: selectedAssetForLease.address,
          tokenId: selectedAssetForLease.tokenId,
        }),
      );
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

    const parseError = (error: Joi.ValidationError) => {
      switch (error.details[0].type) {
        case 'number.base': {
          return 'Please enter a number.';
        }
        case 'number.min': {
          if (!error.details[0].context) {
            return;
          }
          const min = error.details[0].context.limit;
          return `Please enter a number greater than ${min}.`;
        }
        case 'number.greater': {
          if (!error.details[0].context || !error.details[0].context.limit) {
            return;
          }
          const field = error.details[0].context.limit.key;
          return `Please enter a number greater than ${camelToText(field)}`;
        }
        default: {
          return '';
        }
      }
    };

    const handleInputChange = (e) => {
      const rawValue = e.target.value;
      const targetName = e.target.name;
      const input = { [targetName]: rawValue };
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
      const newLeaseForm = cloneDeep(leaseForm);
      newLeaseForm[targetName] = parseInt(rawValue, 10);
      setLeaseForm(newLeaseForm);
    };

    return (
      <UIModal
        klasses={styles.modal}
        modalOpen={!!selectedAssetForLease}
        renderHeader={() => (
          <div className={styles.modalHeader}>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              Create Lease
            </Typography>
            <IconButton
              style={{ color: 'white' }}
              onClick={() => setSelectedAssetForLease && setSelectedAssetForLease(null)}
            >
              <CloseIcon fontSize="medium" />
            </IconButton>
          </div>
        )}
        renderBody={() => (
          <div className={styles.modalContent}>
            <div className={styles.modalContentLeft}>
              <Typography variant="body2" className={styles.assetName}>
                {selectedAssetForLease.name}
              </Typography>
              <div
                className={styles.assetImage}
                style={{
                  background: `url('${selectedAssetForLease.imageOriginalUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
            </div>
            <div className={styles.modalContentRight}>
              <div className={styles.modalContentRow} style={{ display: 'flex' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                    Lease Token
                  </Typography>
                  <StyledSelect
                    value={leaseForm.rentToken}
                    variant="filled"
                    fullWidth
                    onChange={handleChange}
                    input={<Input className={styles.underline} />}
                    style={{ height: '30px' }}
                    disabled={isTransacting || approveLoading}
                  >
                    {tokens.map((token) => (
                      <MenuItem key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </div>
                <div style={{ flex: 1 }}>
                  <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                    Lease Amount
                  </Typography>
                  <RadiusInput
                    fullWidth
                    placeholder={`Monthly rent in ${leaseForm.rentToken}`}
                    style={{ height: '30px' }}
                    name="rentAmount"
                    onChange={handleInputChange}
                    disabled={isTransacting || approveLoading}
                  />
                  {errors.rentAmount && (
                    <Typography variant="body2" className={styles.errorMessage}>
                      {errors.rentAmount}
                    </Typography>
                  )}
                </div>
              </div>
              <div className={styles.modalContentRow} style={{ display: 'flex' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                    Deposit Amount
                  </Typography>
                  <RadiusInput
                    fullWidth
                    style={{ height: '30px' }}
                    name="deposit"
                    placeholder={`Deposit in ${leaseForm.rentToken}`}
                    onChange={handleInputChange}
                    disabled={isTransacting || approveLoading}
                  />
                  {errors.deposit && (
                    <Typography variant="body2" className={styles.errorMessage}>
                      {errors.deposit}
                    </Typography>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                    Grace Period
                  </Typography>
                  <RadiusInput
                    fullWidth
                    placeholder="Late rent allowed (in days)"
                    name="gracePeriod"
                    style={{ height: '30px' }}
                    onChange={handleInputChange}
                    disabled={isTransacting || approveLoading}
                  />
                  {errors.gracePeriod && (
                    <Typography variant="body2" className={styles.errorMessage}>
                      {errors.gracePeriod}
                    </Typography>
                  )}
                </div>
              </div>
              <div className={styles.modalContentRow}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Lease Length (in months)
                </Typography>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <RadiusInput
                      fullWidth
                      placeholder="Min."
                      name="minLeaseLength"
                      style={{ height: '30px' }}
                      onChange={handleInputChange}
                      disabled={isTransacting || approveLoading}
                    />
                    {errors.minLeaseLength && (
                      <Typography variant="body2" className={styles.errorMessage}>
                        {errors.minLeaseLength}
                      </Typography>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <RadiusInput
                      fullWidth
                      placeholder="Max."
                      style={{ height: '30px' }}
                      name="maxLeaseLength"
                      onChange={handleInputChange}
                      disabled={isTransacting || approveLoading}
                    />
                    {errors.maxLeaseLength && (
                      <Typography variant="body2" className={styles.errorMessage}>
                        {errors.maxLeaseLength}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.modalContentRow}>
                <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                  Auto Generate
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    indeterminate={false}
                    checked={leaseForm.autoRegenerate}
                    onChange={handleCheck}
                    style={{ padding: '0 0.5rem 0 0', color: theme.palette.primary.main }}
                    disabled={isTransacting || approveLoading}
                  />
                  <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                    When the lease ends, authorize the platform to automatically put it back on the
                    market.
                  </Typography>
                </div>
              </div>
              <div>
                <Typography
                  variant="body2"
                  style={{ paddingBottom: '0.25rem', fontSize: '0.8rem' }}
                >
                  Terms:
                </Typography>
                <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae neque hic,
                  dolor nostrum, fugit ipsam ab atque minus repudiandae obcaecati alias saepe,
                  maiores sapiente officiis repellendus magnam. Inventore, qui at!
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
              onClick={!isDokoApproved ? approveLease : createLease}
              disabled={isTransacting || approveLoading}
            >
              {!isDokoApproved ? 'Approve' : 'Create'}
            </Button>
          </div>
        )}
      />
    );
  },
);

export default LeaseModal;
