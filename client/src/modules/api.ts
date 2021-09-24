import api from '../libs/api';
import axios from 'axios';
import { Connection } from'@solana/web3.js';

export const getNFTs = (address: string, offset: number, params: any = {}) =>
  api.get('/nfts', {
    params: {
      address,
      offset,
      ...params
    }
  });

export const indexAddress = (address: string, reindex = false) =>
  api.post('/nfts/index', {
    address,
    reindex
  });

export const getSolanaNFTs = (address: string) => {
  return axios.post('https://api.mainnet-beta.solana.com', {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTokenAccountsByOwner",
    "params": [
      address,
      {
        "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      },
      {
        "encoding": "jsonParsed"
      }
    ]
  }).then(res => {
    let promiseList: any[] = [];
    res.data.result.value.forEach((nft: any) => {
      let info = nft.account.data.parsed.info;
      if (info.tokenAmount.amount === "1" && info.tokenAmount.decimals === 0) {
        console.log(info.mint);
        promiseList.push(getSolanaNFTsMetadata(info.mint));
      }
    })
    return Promise.all(promiseList);
  }).then(res => {
    return {data: res}
  })
}

const getSolanaNFTsMetadata = (mintAddress: string) => {
  return axios
    .get(`https://api.solscan.io/account?address=${mintAddress}`)
    .then(res => {
      console.log(res);
      return axios.get(res.data.data.metadata.data.uri);
  }).then(res => {
    console.log(res);
    return {
      _id: mintAddress,
      chain: 'solana',
      metadata: res.data,
      name: res.data.name,
      symbol: res.data.symbol
    }
  })
}

export const getAddressStatus = (address: string) => api.get(`/address/${address}`);
