import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { LeaseForm } from '../../components/landProfile/LeaseModal';
import { AssetForLease } from '../../components/landProfile/OwnershipView';
import { AcceptedTokens } from '../../constants/acceptedTokens';
import ContractServiceAPI from '../../libs/contract-service-api';
import DokoRental from '../../contracts/DokoRental.json';

interface Lease {
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
}

const initialState: Lease[] = [];

interface Payload {
  leaseForm: LeaseForm;
  walletAddress: string;
  asset: AssetForLease;
  dokoRentalContract: ethers.Contract;
}

// export const createLeaseToServer = createAsyncThunk(
//   'Lease/createLeaseToServer',
//   async ({ leaseForm, walletAddress, asset }: Payload) => {
//     const leaseDetails = {
//       ...leaseForm,
//       tokenId: asset.tokenId,
//       rentorAddress: walletAddress,
//       contractAddress: asset.address,
//     };
//     const leaseCreated = await ContractServiceAPI.createLease(leaseDetails);
//     console.log('leaseCreated', leaseCreated);
//   },
// );

export const createLeaseToBlockchain = createAsyncThunk(
  'Lease/createLeaseToBlockchain',
  async ({ leaseForm, walletAddress, asset, dokoRentalContract }: Payload) => {
    console.log('hihihihi1', dokoRentalContract);
    const nftType =
      asset.address === '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d' ? 'land' : 'estate';
    const leaseDetails = [
      ethers.utils.parseEther(leaseForm.rentAmount.toFixed(1)),
      ethers.utils.parseEther(leaseForm.deposit.toFixed(1)),
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
    const lease = [walletAddress, '0x0000000000000000000000000000000000000000'];
    console.log('leaseDetails', leaseDetails);
    console.log('lease', lease);
    const haha = await dokoRentalContract.createLease(lease, leaseDetails, false);
    console.log(haha);
  },
);

const leaseSlice = createSlice({
  name: 'Lease',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createLeaseToBlockchain.fulfilled, (state, action) => ({
      ...state,
      // ...action.payload,
    }));
  },
});

// export const { getUserOwnership } = leaseSlice.actions;

export const lease = leaseSlice.reducer;
