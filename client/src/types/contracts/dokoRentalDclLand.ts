import { ethers, ContractTransaction } from 'ethers';
import { AcceptedTokens } from '../../constants/acceptedTokens';

export type LeaseDetails = [
  ethers.BigNumber,
  ethers.BigNumber,
  number,
  string,
  string,
  string,
  number,
  number,
  AcceptedTokens,
  boolean,
  boolean,
  boolean,
];

export type LeasePayload = [string, string, string];

export interface DclLandRentalContract extends ethers.Contract {
  acceptLease: (
    assetId: string,
    finalLeaseLength: number,
    options: { value: ethers.BigNumber },
  ) => Promise<ContractTransaction>;
  createLease: (
    lease: LeasePayload,
    leaseDetails: LeaseDetails,
    isUpdate: boolean,
  ) => Promise<ContractTransaction>;
}
