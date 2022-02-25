import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { LeaseForm } from '../../components/landProfile/EditLeaseModal';
import { AcceptedTokens } from '../../constants/acceptedTokens';
import metaverses from '../../constants/metaverses';
import ContractServiceAPI from '../../libs/contract-service-api';
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
  createdAt: string;
  updatedAt: string;
}

const initialState: Lease[][][] = metaverses.map(() => []);

interface ICreateLease {
  leaseForm: LeaseForm;
  walletAddress: string;
  assetId: string;
  dokoRentalContract: ethers.Contract;
  isUpdate: boolean;
}

export const upsertLeaseToBlockchain = createAsyncThunk(
  'MetaverseLeases/upsertLeaseToBlockchain',
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
