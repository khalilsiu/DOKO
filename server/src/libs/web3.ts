// import * as Contract from 'web3-eth-contract';
// import * as abis from './abi';

// const providers = {
//   eth: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
//   bsc: 'https://bsc-dataseed.binance.org',
//   polygon: 'https://rpc-mainnet.maticvigil.com',
// };

// module.exports = {
//   getNftTokenUri: async (nft) => {
//     const methods = {
//       ERC721: 'tokenURI',
//       ERC1155: 'uri',
//     };
//     const { token_id, token_address, contract_type, chain } = nft;
//     Contract.setProvider(providers[chain]);
//     const contract = new Contract(abis[contract_type], token_address);
//     try {
//       const token_uri = await contract.methods[methods[contract_type]](
//         token_id,
//       ).call();
//       return token_uri;
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
