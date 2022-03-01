import axios from 'axios';
import { deserializeUnchecked, BinaryReader, BinaryWriter } from 'borsh';
import { Connection, PublicKey, AccountInfo } from '@solana/web3.js';
import { METADATA_SCHEMA, Metadata } from './classes';
import { MetadataKey, StringPublicKey } from './types';

const base58 = require('bs58');

const solanaRpcUrl = 'https://black-fragrant-tree.solana-mainnet.quiknode.pro/580c20b14f5a8fb782624bdce35ee63037ee3d3c/';
export const solanaConnection = new Connection(solanaRpcUrl);
const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

const isMetadataAccount = (account: AccountInfo<Buffer>) =>
  
  account.owner.toBase58() === METADATA_PROGRAM_ID;

const isMetadataV1Account = (account: AccountInfo<Buffer>) =>
  
  account.data[0] === MetadataKey.MetadataV1;

const decodeMetadata = (buffer: Buffer): Metadata => {
  const metadata = deserializeUnchecked(METADATA_SCHEMA,
    Metadata,
    buffer) as Metadata;

  metadata.data.name = metadata.data.name.replace(/\0/g, '');
  metadata.data.symbol = metadata.data.symbol.replace(/\0/g, '');
  metadata.data.uri = metadata.data.uri.replace(/\0/g, '');
  return metadata;
};

export const getTokenInfo = async (mintAddress: string) => {
  try {
    const seed = [Buffer.from('metadata'), (new PublicKey(METADATA_PROGRAM_ID)).toBuffer(), new PublicKey(mintAddress).toBuffer()];
    const tokenProgramAddressRes = await PublicKey
      .findProgramAddress(seed, new PublicKey(METADATA_PROGRAM_ID));
    const tokenAddress = tokenProgramAddressRes[0].toBase58();
    const accountInfo = await solanaConnection.getAccountInfo(new PublicKey(tokenAddress));
    if (accountInfo && accountInfo.data.length > 0) {
      if (!isMetadataAccount(accountInfo)) return {};
      if (isMetadataV1Account(accountInfo)) {
        const metadata = decodeMetadata(accountInfo.data);
        return metadata;
      }
    }
  } catch (err) {
    
    console.error(err);
  }
  return {};
};

export const getTokenAccountsByOwner = (address: string) =>
  
  axios.post(solanaRpcUrl, {
    jsonrpc: '2.0',
    id: 1,
    method: 'getTokenAccountsByOwner',
    params: [
      address,
      {
        programId: TOKEN_PROGRAM_ID,
      },
      {
        encoding: 'jsonParsed',
      },
    ],
  });

export const getTokenOwner = async (address: string) => {
  const res = await axios.post(solanaRpcUrl, {
    jsonrpc: '2.0',
    id: 1,
    method: 'getTokenLargestAccounts',
    params: [
      address,
    ],
  });
  let add = '';
  res.data.result.value.forEach((data: any) => {
    if (data.uiAmount > 0) {
      add = data.address;
    }
  });
  const accountInfo = await axios.post(solanaRpcUrl, {
    jsonrpc: '2.0',
    id: 1,
    method: 'getAccountInfo',
    params: [
      add,
      {
        encoding: 'jsonParsed',
      },
    ],
  });
  return accountInfo.data.result.value.data.parsed.info.owner;
};

export const getSolanaNFTMetadata = async (NFTMetadata: Metadata) => {
  try {
    const metadata: any = await axios.get(NFTMetadata.data.uri);
    return {
      mint: NFTMetadata.mint,
      metadata,
    };
  } catch (err) {
    
    console.error(err);
  }
  return {};
};

const extendBorsh = () => {
  (BinaryReader.prototype as any).readPubkey = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return new PublicKey(array);
  };

  (BinaryWriter.prototype as any).writePubkey = function (value: any) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(value.toBuffer());
  };

  (BinaryReader.prototype as any).readPubkeyAsString = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return base58.encode(array) as StringPublicKey;
  };

  (BinaryWriter.prototype as any).writePubkeyAsString = function (value: StringPublicKey) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(base58.decode(value));
  };
};
extendBorsh();
