import config from 'config';
import DclLandRental from '../contracts/DclLandRental.json';

export const rentalContracts = [
  {
    label: 'DCL Land Rental Contract',
    symbol: 'dclLandRental',
    address: config.dclLandRentalAddress,
    abi: DclLandRental.abi,
  },
];
