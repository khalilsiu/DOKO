declare const window: any;
import { ethers, Contract } from 'ethers';
import DokoRental from '../contracts/DokoRental.json';
import DecentralandAbi from '../contracts/Decentraland.json';

interface IGetBlockchain {
  signerAddress?: string;
  signer?: ethers.providers.JsonRpcSigner;
  rentalContract?: ethers.Contract;
  decentralandContract?: ethers.Contract;
}

const connectMetamask = (): Promise<IGetBlockchain> => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        const rentalContract = new Contract(DokoRental.address, DokoRental.abi, signer);
        const decentralandContract = new Contract(
          '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
          DecentralandAbi,
          signer,
        );
        resolve({ signerAddress, signer, rentalContract, decentralandContract });
      }

      resolve({
        signerAddress: undefined,
        signer: undefined,
        rentalContract: undefined,
        decentralandContract: undefined,
      });
    });
  });
};

export default connectMetamask;
