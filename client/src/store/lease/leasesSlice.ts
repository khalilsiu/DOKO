import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { LeaseForm } from '../../components/landProfile/LeaseModal';
import { AcceptedTokens } from '../../constants/acceptedTokens';
import ContractServiceAPI, { IGetLeases } from '../../libs/contract-service-api';
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
  assetId: string;
  contractAddress: string;
}

const initialState: Lease[] = [];

interface ICreateLease {
  leaseForm: LeaseForm;
  walletAddress: string;
  assetId: string;
  dokoRentalContract: ethers.Contract;
  isUpdate: boolean;
}

export const upsertLeaseToBlockchain = createAsyncThunk(
  'Leases/upsertLeaseToBlockchain',
  async ({ leaseForm, walletAddress, assetId, dokoRentalContract, isUpdate }: ICreateLease) => {
    const leaseDetails = [
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
    const lease = [walletAddress, '0x0000000000000000000000000000000000000000', assetId];
    await dokoRentalContract.createLease(lease, leaseDetails, isUpdate);
  },
);

export const getLeases = createAsyncThunk('Leases/getLesaes', async (payload: IGetLeases) => {
  const lease = await ContractServiceAPI.getLeases(payload);
  return camelize(lease);
});

const leasesSlice = createSlice({
  name: 'Leases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLeases.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = leaseSlice.actions;

export const leases = leasesSlice.reducer;
