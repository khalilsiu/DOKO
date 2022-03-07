import DclLandRental from '../contracts/DclLandRental.json';

export const rentalContracts = [
  {
    label: 'DCL Land Rental Contract',
    symbol: 'dclLandRental',
    address: process.env.REACT_APP_DCL_LAND_RENTAL_ADDRESS || '',
    abi: DclLandRental.abi,
  },
];
