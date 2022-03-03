import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { LeaseForm } from '../../components/landProfile/EditLeaseModal';
import { AcceptedTokens, tokens } from '../../constants/acceptedTokens';
import metaverses from '../../constants/metaverses';
import ContractServiceAPI from '../../libs/contract-service-api';
import { ThunkError } from '../../types';
import {
  DokoRentalContract,
  LeaseDetails,
  LeasePayload,
} from '../../types/contracts/dokoRentalDclLand';
import { camelize } from '../../utils/utils';

export interface Lease {
  rentAmount: number;
  deposit: number;
  monthsPaid: number;
  gracePeriod: number;
  minLeaseLength: number;
  maxLeaseLength: number;
  finalLeaseLength: number;
  dateSigned: Date;
  rentToken: AcceptedTokens;
  isOpen: boolean;
  isLeased: boolean;
  autoRegenerate: boolean;
  rentorAddress: string;
  renteeAddress: string;
  tokenId: string;
  contractAddress: string;
  createdAt: string;
  updatedAt: string;
}

const initialState: Lease[][][] = metaverses.map(() => []);

interface IUpsertLease {
  leaseForm: LeaseForm;
  walletAddress: string;
  assetId: string;
  dokoRentalDclLandContract: DokoRentalContract;
  isUpdate: boolean;
}

interface IAcceptLease {
  assetId: string;
  finalLeaseLength: number;
  dokoRentalDclLandContract: DokoRentalContract;
  rentAmount: number;
  deposit: number;
  rentToken: AcceptedTokens;
}

export const upsertLeaseToBlockchain = createAsyncThunk<
  void,
  IUpsertLease,
  { rejectValue: ThunkError }
>(
  'MetaverseLeases/upsertLeaseToBlockchain',
  async (
    { leaseForm, walletAddress, assetId, dokoRentalDclLandContract, isUpdate }: IUpsertLease,
    { rejectWithValue },
  ) => {
    try {
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
      const lease: LeasePayload = [
        walletAddress,
        '0x0000000000000000000000000000000000000000',
        assetId,
      ];
      // does not wait for txn to resolve
      await dokoRentalDclLandContract.createLease(lease, leaseDetails, isUpdate);
    } catch (e: any) {
      // pass custom error message to reducer
      const message = e.data && e.data.message ? e.data.message : e.message;
      return rejectWithValue({ error: message } as ThunkError);
    }
  },
);

export const acceptLeaseToBlockchain = createAsyncThunk<
  void,
  IAcceptLease,
  { rejectValue: ThunkError }
>(
  'MetaverseLeases/acceptLeaseToBlockchain',
  async (
    {
      assetId,
      finalLeaseLength,
      dokoRentalDclLandContract,
      rentAmount,
      deposit,
      rentToken,
    }: IAcceptLease,
    { rejectWithValue },
  ) => {
    try {
      const payment = rentAmount + deposit;
      const token = tokens.find((token) => token.symbol === AcceptedTokens[rentToken]);
      if (!token) {
        throw new Error(`${rentToken} not an accepted token.`);
      }
      const options = { value: ethers.utils.parseUnits(payment.toString(), token.decimals) };
      // does not wait for txn to resolve
      await dokoRentalDclLandContract.acceptLease(assetId, finalLeaseLength, options);
    } catch (e) {
      return rejectWithValue({ error: (e as any).data.message } as ThunkError);
    }
  },
);

export const getMetaverseLeases = createAsyncThunk(
  'MetaverseLeases/getLesaes',
  async (payload: any) => {
    const metavereseLeases: Lease[][][] = [];

    for (const metaverse of metaverses) {
      const contractsLeases = await Promise.all(
        metaverse.addresses.map((address) =>
          ContractServiceAPI.getLeases({ lessor: payload.lessor, contractAddress: address }).catch(
            (err) => {
              if (err.response.status === 404) {
                return [];
              }
            },
          ),
        ),
      );

      metavereseLeases.push(
        contractsLeases.map((contractLeases) => {
          return contractLeases.map((lease) =>
            camelize({
              ...lease.lease,
            }),
          );
        }),
      );
    }
    return metavereseLeases;
  },
);

const metaverseLeasesSlice = createSlice({
  name: 'MetaverseLeases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMetaverseLeases.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = leaseSlice.actions;

export const metaverseLeases = metaverseLeasesSlice.reducer;
