import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AcceptedTokens } from '../../constants/acceptedTokens';
import ContractServiceAPI, { IGetLease } from '../../libs/contract-service-api';
import { camelize } from '../../utils/utils';
import { Lease } from './leasesSlice';

const initialState: Lease = {
  rentAmount: 0,
  deposit: 0,
  monthsPaid: 0,
  gracePeriod: 0,
  minLeaseLength: 0,
  maxLeaseLength: 0,
  finalLeaseLength: 0,
  dateSigned: new Date(),
  rentToken: AcceptedTokens['ETH'],
  isOpen: true,
  isLeased: false,
  autoRegenerate: false,
  rentorAddress: '',
  renteeAddress: '',
  assetId: '',
  contractAddress: '',
};

export const getLease = createAsyncThunk('Lease/getLesae', async (payload: IGetLease) => {
  const lease = await ContractServiceAPI.getLease(payload);
  return camelize(lease);
});

const leaseSlice = createSlice({
  name: 'Lease',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLease.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = leaseSlice.actions;

export const lease = leaseSlice.reducer;
