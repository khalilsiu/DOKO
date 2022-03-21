import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaseForm } from 'components/rentals/LeaseDetailModal';
import metaverses from 'constants/metaverses';
import { ethers } from 'ethers';
import { Asset } from 'store/profile/profileOwnershipSlice';
import { AcceptedTokens, tokens } from '../../constants/acceptedTokens';
import { ThunkError } from '../../types';
import { LeaseDetails, LeasePayload } from '../../types/contracts/dokoRentalDclLand';

export interface Lease {
  rentAmount: number;
  deposit: number;
  monthsPaid: number;
  gracePeriod: number;
  minLeaseLength: number;
  maxLeaseLength: number;
  finalLeaseLength: number;
  dateSigned: string;
  rentToken: AcceptedTokens;
  isOpen: boolean;
  isLeased: boolean;
  autoRegenerate: boolean;
  lessor: string;
  lessee: string;
  tokenId: string;
  contractAddress: string;
  createdAt: string;
  updatedAt: string;
}

const initialState: Lease[][][] = metaverses.map(() => []);

interface IUpsertLease {
  leaseForm: LeaseForm;
  operator: string;
  dclLandRentalContract: ethers.Contract | null;
  isUpdate: boolean;
}

interface IAcceptLease {
  finalLeaseLength: number;
  dclLandRentalContract: ethers.Contract | null;
  operator: string;
}

interface IPayRent {
  dclLandRentalContract: ethers.Contract | null;
  operator: string;
}

export const upsertLease = createAsyncThunk<void, IUpsertLease, { rejectValue: ThunkError }>(
  'leases/upsertLease',
  async ({ leaseForm, operator, dclLandRentalContract, isUpdate }: IUpsertLease, { rejectWithValue, getState }) => {
    try {
      if (!dclLandRentalContract) {
        throw new Error('Thunk error: Land rental contract initialization error');
      }
      const { asset } = getState() as { asset: Asset };
      if (asset.ownerAddress !== operator) {
        throw new Error('Thunk error: Only land owner can create lease');
      }
      const leaseDetails: LeaseDetails = [
        ethers.utils.parseEther(leaseForm.rentAmount),
        ethers.utils.parseEther(leaseForm.deposit),
        0,
        leaseForm.gracePeriod,
        leaseForm.minLeaseLength,
        leaseForm.maxLeaseLength,
        0,
        0,
        leaseForm.rentToken,
        true,
        false,
        leaseForm.autoRegenerate,
      ];
      const lease: LeasePayload = [operator, '0x0000000000000000000000000000000000000000', asset.tokenId];
      // does not wait for txn to resolve
      await dclLandRentalContract.createLease(lease, leaseDetails, isUpdate);
    } catch (e: any) {
      // pass custom error message to reducer
      const message = e.data && e.data.message ? e.data.message : e.message;
      return rejectWithValue({ error: message } as ThunkError);
    }
  },
);

export const acceptLease = createAsyncThunk<void, IAcceptLease, { rejectValue: ThunkError }>(
  'leases/acceptLease',
  async ({ finalLeaseLength, dclLandRentalContract, operator }: IAcceptLease, { rejectWithValue, getState }) => {
    try {
      if (!dclLandRentalContract) {
        throw new Error('Thunk error: Land rental contract initialization error');
      }
      const { asset } = getState() as { asset: Asset };

      if (!asset.lease) {
        throw new Error('Thunk error: Lease does not exist for asset');
      }
      if (asset.ownerAddress === operator) {
        throw new Error('Thunk error: Land owner cannot enter lease of owned asset');
      }
      const { rentAmount, deposit, rentToken } = asset.lease;
      const payment = rentAmount + deposit;
      const token = tokens.find((token) => token.symbol === AcceptedTokens[rentToken]);

      if (!token) {
        throw new Error(`${rentToken} not an accepted token.`);
      }

      const options =
        rentToken === AcceptedTokens['ETH']
          ? {
              value: ethers.utils.parseUnits(payment.toString(), token.decimals),
            }
          : null;
      // does not wait for txn to resolve
      await dclLandRentalContract.acceptLease(asset.tokenId, finalLeaseLength, options);
    } catch (e: any) {
      const message = (e.data && e.data.message) ?? e.toString();
      return rejectWithValue({ error: message } as ThunkError);
    }
  },
);

export const payRent = createAsyncThunk<void, IPayRent, { rejectValue: ThunkError }>(
  'leases/acceptLease',
  async ({ dclLandRentalContract, operator }, { rejectWithValue, getState }) => {
    try {
      if (!dclLandRentalContract) {
        throw new Error('Thunk error: Land rental contract initialization error');
      }
      const { asset } = getState() as { asset: Asset };
      if (!asset.lease) {
        throw new Error('Thunk error: Lease does not exist for asset');
      }
      console.log('asset', asset.lease);
      if (asset.lease.lessee !== operator) {
        throw new Error('Thunk error: Lessee can only pay rent to rented lands');
      }
      await dclLandRentalContract.payRent(asset.tokenId);
    } catch (e: any) {
      const message = (e.data && e.data.message) ?? e.toString();
      return rejectWithValue({ error: message } as ThunkError);
    }
  },
);

const leasesSlice = createSlice({
  name: 'leases',
  initialState,
  reducers: {},
});

// export const { getUserOwnership } = leaseSlice.actions;

export const leases = leasesSlice.reducer;
