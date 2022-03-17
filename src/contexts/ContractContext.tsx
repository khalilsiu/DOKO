import { Contract, ethers } from 'ethers';
import React from 'react';
import metaverses from 'constants/metaverses';
import { tokens } from 'constants/acceptedTokens';
import { rentalContracts } from 'constants/rentals';
import { useDispatch } from 'react-redux';
import { openToast } from 'store/app/appStateSlice';

declare let window: any;

type ContractNames = 'dclLandRental' | 'dclLand' | 'USDT';

type Contracts = Record<ContractNames, ethers.Contract | null>;

export interface ContractContextType {
  connectContract: (symbol: ContractNames) => void;
  contracts: Contracts;
}

export const ContractContext = React.createContext<ContractContextType>(null as any);

export const ContractContextProvider = React.memo(({ children }) => {
  const dispatch = useDispatch();
  const [signer, setSigner] = React.useState<ethers.providers.JsonRpcSigner | null>(null);

  const [contracts, setContracts] = React.useState<Contracts>({
    dclLandRental: null,
    dclLand: null,
    USDT: null,
  });

  React.useEffect(() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
    } catch (e: any) {
      console.log(e.reason);
      if (e.reason === 'missing provider') {
        // User has not installed Google Chrome Metamask extension yet
        window.location.href = 'https://metamask.app.link/dapp/doko.one';
      }
    }
  }, []);

  const connectContract = React.useCallback(
    (symbol: ContractNames) => {
      const metaverseContracts = metaverses.map((metaverse) => metaverse.contracts).flat();
      const contract = [...tokens, ...rentalContracts, ...metaverseContracts].find(
        (contract) => contract.symbol === symbol,
      );

      if (!contract) {
        dispatch(openToast({ message: `${contract} not found`, state: 'error' }));
        return;
      }
      if (!signer) {
        dispatch(openToast({ message: `Signer is not initialized`, state: 'error' }));
        return;
      }

      setContracts((state) => ({
        ...state,
        [symbol]: new Contract(contract.address || '', contract.abi, signer),
      }));
    },
    [dispatch, signer],
  );

  return <ContractContext.Provider value={{ connectContract, contracts }}>{children}</ContractContext.Provider>;
});
