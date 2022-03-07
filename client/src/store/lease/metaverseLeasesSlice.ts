import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { LeaseForm } from '../../components/landProfile/EditLeaseModal';
import { AcceptedTokens, tokens } from '../../constants/acceptedTokens';
import metaverses from '../../constants/metaverses';
import ContractServiceAPI from '../../libs/contract-service-api';
import { ThunkError } from '../../types';
import { LeaseDetails, LeasePayload } from '../../types/contracts/dokoRentalDclLand';
import { camelize } from '../../utils/utils';
import { Asset } from '../summary';

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
  dclLandRentalContract: ethers.Contract;
  isUpdate: boolean;
}

interface IAcceptLease {
  assetId: string;
  finalLeaseLength: number;
  dclLandRentalContract: ethers.Contract;
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
    { leaseForm, walletAddress, assetId, dclLandRentalContract, isUpdate }: IUpsertLease,
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
      await dclLandRentalContract.createLease(lease, leaseDetails, isUpdate);
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
    { assetId, finalLeaseLength, dclLandRentalContract }: IAcceptLease,
    { rejectWithValue, getState },
  ) => {
    try {
      const { asset } = getState() as { asset: Asset };
      if (!asset.lease) {
        throw new Error('Thunk error: Lease does not exist for asset');
      }
      const { rentAmount, deposit, rentToken } = asset.lease;
      const payment = rentAmount + deposit;
      const token = tokens.find((token) => token.symbol === AcceptedTokens[rentToken]);

      if (!token) {
        throw new Error(`${rentToken} not an accepted token.`);
      }

      const options = rentToken === AcceptedTokens['ETH'] && {
        value: ethers.utils.parseUnits(payment.toString(), token.decimals),
      };
      // does not wait for txn to resolve
      await dclLandRentalContract.acceptLease(assetId, finalLeaseLength, options);
    } catch (e: any) {
      console.log(e);
      const message = (e.data && e.data.message) ?? e.toString();
      return rejectWithValue({ error: message } as ThunkError);
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
