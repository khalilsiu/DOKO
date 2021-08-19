/* tslint:disable */
// @ts-nocheck

import * as url from "url";
import isomorphicFetch from "isomorphic-fetch";
import { Configuration } from "./configuration";

const BASE_PATH = "https://deep-index.moralis.io/api/v2".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
  csv: ",",
  ssv: " ",
  tsv: "\t",
  pipes: "|",
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
  (url: string, init?: any): Promise<Response>;
}

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
  url: string;
  options: any;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
  protected configuration!: Configuration;

  constructor(
    configuration?: Configuration,
    protected basePath: string = BASE_PATH,
    protected fetch: FetchAPI = isomorphicFetch
  ) {
    if (configuration) {
      this.configuration = configuration;
      this.basePath = configuration.basePath || this.basePath;
    }
  }
}

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
  name: "RequiredError";
  constructor(public field: string, msg?: string) {
    super(msg);
  }
}

/**
 *
 * @export
 * @interface Block
 */
export interface Block {
  /**
   * The block timestamp
   * @type {string}
   * @memberof Block
   */
  timestamp: string;
  /**
   * The block number
   * @type {string}
   * @memberof Block
   */
  number: string;
  /**
   * The block hash
   * @type {string}
   * @memberof Block
   */
  hash: string;
  /**
   * The block hash of the parent block
   * @type {string}
   * @memberof Block
   */
  parentHash: string;
  /**
   * The nonce
   * @type {string}
   * @memberof Block
   */
  nonce: string;
  /**
   *
   * @type {string}
   * @memberof Block
   */
  sha3Uncles: string;
  /**
   *
   * @type {string}
   * @memberof Block
   */
  logsBloom: string;
  /**
   *
   * @type {string}
   * @memberof Block
   */
  transactionsRoot: string;
  /**
   *
   * @type {string}
   * @memberof Block
   */
  stateRoot: string;
  /**
   *
   * @type {string}
   * @memberof Block
   */
  receiptsRoot: string;
  /**
   * The address of the miner
   * @type {string}
   * @memberof Block
   */
  miner: string;
  /**
   * The difficulty of the block
   * @type {string}
   * @memberof Block
   */
  difficulty: string;
  /**
   * The total difficulty
   * @type {string}
   * @memberof Block
   */
  totalDifficulty: string;
  /**
   * The block size
   * @type {string}
   * @memberof Block
   */
  size: string;
  /**
   *
   * @type {string}
   * @memberof Block
   */
  extraData: string;
  /**
   * The gas limit
   * @type {string}
   * @memberof Block
   */
  gasLimit: string;
  /**
   * The gas used
   * @type {string}
   * @memberof Block
   */
  gasUsed: string;
  /**
   * The number of transactions in the block
   * @type {string}
   * @memberof Block
   */
  transactionCount: string;
  /**
   * The transactions in the block
   * @type {Array<BlockTransaction>}
   * @memberof Block
   */
  transactions: Array<BlockTransaction>;
}
/**
 *
 * @export
 * @interface BlockTransaction
 */
export interface BlockTransaction {
  /**
   * The hash of the transaction
   * @type {string}
   * @memberof BlockTransaction
   */
  hash: string;
  /**
   * The nonce
   * @type {string}
   * @memberof BlockTransaction
   */
  nonce: string;
  /**
   *
   * @type {string}
   * @memberof BlockTransaction
   */
  transactionIndex: string;
  /**
   * The from address
   * @type {string}
   * @memberof BlockTransaction
   */
  fromAddress: string;
  /**
   * The to address
   * @type {string}
   * @memberof BlockTransaction
   */
  toAddress: string;
  /**
   * The value sent
   * @type {string}
   * @memberof BlockTransaction
   */
  value: string;
  /**
   *
   * @type {string}
   * @memberof BlockTransaction
   */
  gas?: string;
  /**
   * The gas price
   * @type {string}
   * @memberof BlockTransaction
   */
  gasPrice: string;
  /**
   *
   * @type {string}
   * @memberof BlockTransaction
   */
  input: string;
  /**
   *
   * @type {string}
   * @memberof BlockTransaction
   */
  receiptCumulativeGasUsed: string;
  /**
   *
   * @type {string}
   * @memberof BlockTransaction
   */
  receiptGasUsed: string;
  /**
   *
   * @type {string}
   * @memberof BlockTransaction
   */
  receiptContractAddress?: string;
  /**
   *
   * @type {string}
   * @memberof BlockTransaction
   */
  receiptRoot?: string;
  /**
   *
   * @type {string}
   * @memberof BlockTransaction
   */
  receiptStatus: string;
  /**
   * The block timestamp
   * @type {string}
   * @memberof BlockTransaction
   */
  blockTimestamp: string;
  /**
   * The block number
   * @type {string}
   * @memberof BlockTransaction
   */
  blockNumber: string;
  /**
   * The hash of the block
   * @type {string}
   * @memberof BlockTransaction
   */
  blockHash: string;
  /**
   * The logs of the transaction
   * @type {Array<Log>}
   * @memberof BlockTransaction
   */
  logs: Array<Log>;
}
/**
 *
 * @export
 * @enum {string}
 */
export enum ChainList {
  Eth = <any>"eth",
  _0x1 = <any>"0x1",
  Ropsten = <any>"ropsten",
  _0x3 = <any>"0x3",
  Rinkeby = <any>"rinkeby",
  _0x4 = <any>"0x4",
  Goerli = <any>"goerli",
  _0x5 = <any>"0x5",
  Kovan = <any>"kovan",
  _0x2a = <any>"0x2a",
  Polygon = <any>"polygon",
  _0x89 = <any>"0x89",
  Mumbai = <any>"mumbai",
  _0x13881 = <any>"0x13881",
  Bsc = <any>"bsc",
  _0x38 = <any>"0x38",
  BscTestnet = <any>"bsc testnet",
  _0x61 = <any>"0x61",
  Localdevchain = <any>"localdevchain",
  Dev = <any>"dev",
}
/**
 *
 * @export
 * @interface Erc20Allowance
 */
export interface Erc20Allowance {
  /**
   * The allowance
   * @type {string}
   * @memberof Erc20Allowance
   */
  allowance: string;
}
/**
 *
 * @export
 * @interface Erc20Metadata
 */
export interface Erc20Metadata {
  /**
   * The address of the token contract
   * @type {string}
   * @memberof Erc20Metadata
   */
  address: string;
  /**
   * The name of the token Contract
   * @type {string}
   * @memberof Erc20Metadata
   */
  name: string;
  /**
   * The symbol of the NFT contract
   * @type {string}
   * @memberof Erc20Metadata
   */
  symbol: string;
  /**
   * The number of decimals on of the token
   * @type {string}
   * @memberof Erc20Metadata
   */
  decimals: string;
  /**
   * The logo of the token
   * @type {string}
   * @memberof Erc20Metadata
   */
  logo?: string;
  /**
   * The logo hash
   * @type {string}
   * @memberof Erc20Metadata
   */
  logoHash?: string;
  /**
   * The thumbnail of the logo
   * @type {string}
   * @memberof Erc20Metadata
   */
  thumbnail?: string;
  /**
   *
   * @type {string}
   * @memberof Erc20Metadata
   */
  blockNumber?: string;
  /**
   *
   * @type {string}
   * @memberof Erc20Metadata
   */
  validated?: string;
}
/**
 *
 * @export
 * @interface Erc20Price
 */
export interface Erc20Price {
  /**
   *
   * @type {NativeErc20Price}
   * @memberof Erc20Price
   */
  nativePrice?: NativeErc20Price;
  /**
   * The price in USD for the token
   * @type {number}
   * @memberof Erc20Price
   */
  usdPrice: number;
  /**
   * The address of the exchange used to calculate the price
   * @type {string}
   * @memberof Erc20Price
   */
  exchangeAddress?: string;
  /**
   * The name of the exchange used for calculating the price
   * @type {string}
   * @memberof Erc20Price
   */
  exchangeName?: string;
}
/**
 *
 * @export
 * @interface Erc20TokenBalance
 */
export interface Erc20TokenBalance {
  /**
   * The address of the token contract
   * @type {string}
   * @memberof Erc20TokenBalance
   */
  tokenAddress: string;
  /**
   * The name of the token Contract
   * @type {string}
   * @memberof Erc20TokenBalance
   */
  name: string;
  /**
   * The symbol of the NFT contract
   * @type {string}
   * @memberof Erc20TokenBalance
   */
  symbol: string;
  /**
   * The logo of the token
   * @type {string}
   * @memberof Erc20TokenBalance
   */
  logo?: string;
  /**
   * The thumbnail of the logo
   * @type {string}
   * @memberof Erc20TokenBalance
   */
  thumbnail?: string;
  /**
   * The number of decimals on of the token
   * @type {string}
   * @memberof Erc20TokenBalance
   */
  decimals: string;
  /**
   * Timestamp of when the contract was last synced with the node
   * @type {string}
   * @memberof Erc20TokenBalance
   */
  balance: string;
}
/**
 *
 * @export
 * @interface Erc20Transaction
 */
export interface Erc20Transaction {
  /**
   * The transaction hash
   * @type {string}
   * @memberof Erc20Transaction
   */
  transactionHash: string;
  /**
   * The address of the token
   * @type {string}
   * @memberof Erc20Transaction
   */
  address: string;
  /**
   * The block timestamp
   * @type {string}
   * @memberof Erc20Transaction
   */
  blockTimestamp: string;
  /**
   * The block number
   * @type {string}
   * @memberof Erc20Transaction
   */
  blockNumber: string;
  /**
   * The block hash
   * @type {string}
   * @memberof Erc20Transaction
   */
  blockHash: string;
  /**
   * The recipient
   * @type {string}
   * @memberof Erc20Transaction
   */
  toAddress: string;
  /**
   * The sender
   * @type {string}
   * @memberof Erc20Transaction
   */
  fromAddress: string;
  /**
   * The value that was transfered (in wei)
   * @type {string}
   * @memberof Erc20Transaction
   */
  value: string;
}
/**
 *
 * @export
 * @interface Erc721Metadata
 */
export interface Erc721Metadata {
  /**
   * The name of the token Contract
   * @type {string}
   * @memberof Erc721Metadata
   */
  name: string;
  /**
   * The symbol of the NFT contract
   * @type {string}
   * @memberof Erc721Metadata
   */
  symbol: string;
  /**
   *
   * @type {string}
   * @memberof Erc721Metadata
   */
  tokenUri?: string;
}
/**
 *
 * @export
 * @interface HistoricalNftTransfer
 */
export interface HistoricalNftTransfer {
  /**
   * The transaction hash
   * @type {string}
   * @memberof HistoricalNftTransfer
   */
  transactionHash: string;
  /**
   * The address of the token
   * @type {string}
   * @memberof HistoricalNftTransfer
   */
  address: string;
  /**
   * The block timestamp
   * @type {string}
   * @memberof HistoricalNftTransfer
   */
  blockTimestamp: string;
  /**
   * The block number
   * @type {string}
   * @memberof HistoricalNftTransfer
   */
  blockNumber: string;
  /**
   * The block hash
   * @type {string}
   * @memberof HistoricalNftTransfer
   */
  blockHash: string;
  /**
   * The recipient
   * @type {string}
   * @memberof HistoricalNftTransfer
   */
  toAddress: string;
  /**
   * The sender
   * @type {string}
   * @memberof HistoricalNftTransfer
   */
  fromAddress: string;
  /**
   * The token ids of the tokens that were transfered
   * @type {Array<string>}
   * @memberof HistoricalNftTransfer
   */
  tokenIds: Array<string>;
  /**
   * The amounts that were transfered
   * @type {Array<string>}
   * @memberof HistoricalNftTransfer
   */
  amounts: Array<string>;
  /**
   * They contract type of the transfer
   * @type {string}
   * @memberof HistoricalNftTransfer
   */
  contractType: string;
}
/**
 *
 * @export
 * @interface Log
 */
export interface Log {
  /**
   *
   * @type {string}
   * @memberof Log
   */
  logIndex: string;
  /**
   * The hash of the transaction
   * @type {string}
   * @memberof Log
   */
  transactionHash: string;
  /**
   *
   * @type {string}
   * @memberof Log
   */
  transactionIndex: string;
  /**
   * The address of the contract
   * @type {string}
   * @memberof Log
   */
  address: string;
  /**
   * The data of the log
   * @type {string}
   * @memberof Log
   */
  data: string;
  /**
   *
   * @type {string}
   * @memberof Log
   */
  topic0: string;
  /**
   *
   * @type {string}
   * @memberof Log
   */
  topic1?: string;
  /**
   *
   * @type {string}
   * @memberof Log
   */
  topic2?: string;
  /**
   *
   * @type {string}
   * @memberof Log
   */
  topic3?: string;
  /**
   * The timestamp of the block
   * @type {string}
   * @memberof Log
   */
  blockTimestamp: string;
  /**
   * The block number
   * @type {string}
   * @memberof Log
   */
  blockNumber: string;
  /**
   * The hash of the block
   * @type {string}
   * @memberof Log
   */
  blockHash: string;
}
/**
 *
 * @export
 * @interface LogEvent
 */
export interface LogEvent {
  /**
   * The transaction hash
   * @type {string}
   * @memberof LogEvent
   */
  transactionHash: string;
  /**
   * The address of the contract
   * @type {string}
   * @memberof LogEvent
   */
  address: string;
  /**
   * The block timestamp
   * @type {string}
   * @memberof LogEvent
   */
  blockTimestamp: string;
  /**
   * The block number
   * @type {string}
   * @memberof LogEvent
   */
  blockNumber: string;
  /**
   * The block hash
   * @type {string}
   * @memberof LogEvent
   */
  blockHash: string;
  /**
   * The content of the event
   * @type {any}
   * @memberof LogEvent
   */
  data: any;
}
/**
 *
 * @export
 * @interface NativeBalance
 */
export interface NativeBalance {
  /**
   * The balance
   * @type {string}
   * @memberof NativeBalance
   */
  balance: string;
}
/**
 *
 * @export
 * @interface NativeErc20Price
 */
export interface NativeErc20Price {
  /**
   * The native price of the token
   * @type {string}
   * @memberof NativeErc20Price
   */
  value: string;
  /**
   * The number of decimals of the token
   * @type {number}
   * @memberof NativeErc20Price
   */
  decimals: number;
  /**
   * The Name of the token
   * @type {string}
   * @memberof NativeErc20Price
   */
  name: string;
  /**
   * The Symbol of the token
   * @type {string}
   * @memberof NativeErc20Price
   */
  symbol: string;
}
/**
 *
 * @export
 * @interface Nft
 */
export interface Nft {
  /**
   * The address of the contract of the NFT
   * @type {string}
   * @memberof Nft
   */
  tokenAddress: string;
  /**
   * The token id of the NFT
   * @type {string}
   * @memberof Nft
   */
  tokenId: string;
  /**
   * The type of NFT contract standard
   * @type {string}
   * @memberof Nft
   */
  contractType: string;
  /**
   * The uri to the metadata of the token
   * @type {string}
   * @memberof Nft
   */
  tokenUri?: string;
  /**
   * The metadata of the token
   * @type {string}
   * @memberof Nft
   */
  metadata?: string;
  /**
   * when the metadata was last updated
   * @type {string}
   * @memberof Nft
   */
  syncedAt?: string;
  /**
   * The number of this item the user owns (used by ERC1155)
   * @type {string}
   * @memberof Nft
   */
  amount?: string;
  /**
   * The name of the Token contract
   * @type {string}
   * @memberof Nft
   */
  name: string;
  /**
   * The symbol of the NFT contract
   * @type {string}
   * @memberof Nft
   */
  symbol: string;
}
/**
 *
 * @export
 * @interface NftCollection
 */
export interface NftCollection {
  /**
   * The total number of matches for this query
   * @type {number}
   * @memberof NftCollection
   */
  total?: number;
  /**
   * The page of the current result
   * @type {number}
   * @memberof NftCollection
   */
  page?: number;
  /**
   * The number of results per page
   * @type {number}
   * @memberof NftCollection
   */
  pageSize?: number;
  /**
   *
   * @type {Array<Nft>}
   * @memberof NftCollection
   */
  result?: Array<Nft>;
}
/**
 *
 * @export
 * @interface NftContractMetadata
 */
export interface NftContractMetadata {
  /**
   * The address of the token contract
   * @type {string}
   * @memberof NftContractMetadata
   */
  tokenAddress: string;
  /**
   * The name of the token Contract
   * @type {string}
   * @memberof NftContractMetadata
   */
  name: string;
  /**
   * The abi of the token Contract
   * @type {string}
   * @memberof NftContractMetadata
   */
  abi?: string;
  /**
   * value -1 if the contract does not support token_uri
   * @type {number}
   * @memberof NftContractMetadata
   */
  supportsTokenUri?: number;
  /**
   * Timestamp of when the contract was last synced with the node
   * @type {string}
   * @memberof NftContractMetadata
   */
  syncedAt?: string;
  /**
   * The symbol of the NFT contract
   * @type {string}
   * @memberof NftContractMetadata
   */
  symbol: string;
  /**
   * The type of NFT contract
   * @type {string}
   * @memberof NftContractMetadata
   */
  contractType: string;
}
/**
 *
 * @export
 * @interface NftContractMetadataCollection
 */
export interface NftContractMetadataCollection {
  /**
   * The total number of matches for this query
   * @type {number}
   * @memberof NftContractMetadataCollection
   */
  total: number;
  /**
   * The page of the current result
   * @type {number}
   * @memberof NftContractMetadataCollection
   */
  page: number;
  /**
   * The number of results per page
   * @type {number}
   * @memberof NftContractMetadataCollection
   */
  pageSize: number;
  /**
   *
   * @type {Array<NftContractMetadata>}
   * @memberof NftContractMetadataCollection
   */
  result: Array<NftContractMetadata>;
}
/**
 *
 * @export
 * @interface NftOwner
 */
export interface NftOwner {
  /**
   * The address of the contract of the NFT
   * @type {string}
   * @memberof NftOwner
   */
  tokenAddress: string;
  /**
   * The token id of the NFT
   * @type {string}
   * @memberof NftOwner
   */
  tokenId: string;
  /**
   * The type of NFT contract standard
   * @type {string}
   * @memberof NftOwner
   */
  contractType: string;
  /**
   * The address of the owner of the NFT
   * @type {string}
   * @memberof NftOwner
   */
  ownerOf: string;
  /**
   * The blocknumber when the amount or owner changed
   * @type {string}
   * @memberof NftOwner
   */
  blockNumber: string;
  /**
   * The blocknumber when the NFT was minted
   * @type {string}
   * @memberof NftOwner
   */
  blockNumberMinted: string;
  /**
   * The uri to the metadata of the token
   * @type {string}
   * @memberof NftOwner
   */
  tokenUri?: string;
  /**
   * The metadata of the token
   * @type {string}
   * @memberof NftOwner
   */
  metadata?: string;
  /**
   * when the metadata was last updated
   * @type {string}
   * @memberof NftOwner
   */
  syncedAt?: string;
  /**
   * The number of this item the user owns (used by ERC1155)
   * @type {string}
   * @memberof NftOwner
   */
  amount?: string;
  /**
   * The name of the Token contract
   * @type {string}
   * @memberof NftOwner
   */
  name: string;
  /**
   * The symbol of the NFT contract
   * @type {string}
   * @memberof NftOwner
   */
  symbol: string;
}
/**
 *
 * @export
 * @interface NftOwnerCollection
 */
export interface NftOwnerCollection {
  /**
   * The total number of matches for this query
   * @type {number}
   * @memberof NftOwnerCollection
   */
  total?: number;
  /**
   * The page of the current result
   * @type {number}
   * @memberof NftOwnerCollection
   */
  page?: number;
  /**
   * The number of results per page
   * @type {number}
   * @memberof NftOwnerCollection
   */
  pageSize?: number;
  /**
   *
   * @type {Array<NftOwner>}
   * @memberof NftOwnerCollection
   */
  result?: Array<NftOwner>;
}
/**
 *
 * @export
 * @interface NftTransfer
 */
export interface NftTransfer {
  /**
   * The address of the contract of the NFT
   * @type {string}
   * @memberof NftTransfer
   */
  tokenAddress: string;
  /**
   * The token id of the NFT
   * @type {string}
   * @memberof NftTransfer
   */
  tokenId: string;
  /**
   * The address that sent the NFT
   * @type {string}
   * @memberof NftTransfer
   */
  fromAddress?: string;
  /**
   * The address that recieved the NFT
   * @type {string}
   * @memberof NftTransfer
   */
  toAddress: string;
  /**
   * The number of tokens transferred
   * @type {string}
   * @memberof NftTransfer
   */
  amount?: string;
  /**
   * The type of NFT contract standard
   * @type {string}
   * @memberof NftTransfer
   */
  contractType: string;
  /**
   * The blocknumber of the transaction
   * @type {string}
   * @memberof NftTransfer
   */
  blockNumber: string;
  /**
   * The block timestamp
   * @type {string}
   * @memberof NftTransfer
   */
  blockTimestamp: string;
  /**
   * The block hash of the transaction
   * @type {string}
   * @memberof NftTransfer
   */
  blockHash: string;
  /**
   * The transaction hash
   * @type {string}
   * @memberof NftTransfer
   */
  transactionHash: string;
  /**
   * The transaction type
   * @type {string}
   * @memberof NftTransfer
   */
  transactionType?: string;
  /**
   * The transaction index
   * @type {string}
   * @memberof NftTransfer
   */
  transactionIndex?: string;
  /**
   * The log index
   * @type {number}
   * @memberof NftTransfer
   */
  logIndex: number;
}
/**
 *
 * @export
 * @interface NftTransferCollection
 */
export interface NftTransferCollection {
  /**
   * The total number of matches for this query
   * @type {number}
   * @memberof NftTransferCollection
   */
  total: number;
  /**
   * The page of the current result
   * @type {number}
   * @memberof NftTransferCollection
   */
  page: number;
  /**
   * The number of results per page
   * @type {number}
   * @memberof NftTransferCollection
   */
  pageSize: number;
  /**
   *
   * @type {Array<NftTransfer>}
   * @memberof NftTransferCollection
   */
  result: Array<NftTransfer>;
}
/**
 *
 * @export
 * @interface Resolve
 */
export interface Resolve {
  /**
   * Resolved domain address
   * @type {string}
   * @memberof Resolve
   */
  address: string;
}
/**
 *
 * @export
 * @interface Transaction
 */
export interface Transaction {
  /**
   * The hash of the transaction
   * @type {string}
   * @memberof Transaction
   */
  hash: string;
  /**
   * The nonce of the transaction
   * @type {string}
   * @memberof Transaction
   */
  nonce: string;
  /**
   * The transaction index
   * @type {string}
   * @memberof Transaction
   */
  transactionIndex: string;
  /**
   * The sender
   * @type {string}
   * @memberof Transaction
   */
  fromAddress: string;
  /**
   * The recipient
   * @type {string}
   * @memberof Transaction
   */
  toAddress: string;
  /**
   * The value that was transfered (in wei)
   * @type {string}
   * @memberof Transaction
   */
  value: string;
  /**
   * The gas of the transaction
   * @type {string}
   * @memberof Transaction
   */
  gas: string;
  /**
   * The gas price
   * @type {string}
   * @memberof Transaction
   */
  gasPrice: string;
  /**
   * The input
   * @type {string}
   * @memberof Transaction
   */
  input: string;
  /**
   * The receipt cumulative gas used
   * @type {string}
   * @memberof Transaction
   */
  receiptCumulativeGasUsed: string;
  /**
   * The receipt gas used
   * @type {string}
   * @memberof Transaction
   */
  receiptGasUsed: string;
  /**
   * The receipt contract address
   * @type {string}
   * @memberof Transaction
   */
  receiptContractAddress: string;
  /**
   * The receipt root
   * @type {string}
   * @memberof Transaction
   */
  receiptRoot: string;
  /**
   * The receipt status
   * @type {string}
   * @memberof Transaction
   */
  receiptStatus: string;
  /**
   * The block timestamp
   * @type {string}
   * @memberof Transaction
   */
  blockTimestamp: string;
  /**
   * The block number
   * @type {string}
   * @memberof Transaction
   */
  blockNumber: string;
  /**
   * The block hash
   * @type {string}
   * @memberof Transaction
   */
  blockHash: string;
}
/**
 *
 * @export
 * @interface TransactionCollection
 */
export interface TransactionCollection {
  /**
   * The total number of matches for this query
   * @type {number}
   * @memberof TransactionCollection
   */
  total?: number;
  /**
   * The page of the current result
   * @type {number}
   * @memberof TransactionCollection
   */
  page?: number;
  /**
   * The number of results per page
   * @type {number}
   * @memberof TransactionCollection
   */
  pageSize?: number;
  /**
   *
   * @type {Array<Transaction>}
   * @memberof TransactionCollection
   */
  result?: Array<Transaction>;
}
/**
 * AccountApi - fetch parameter creator
 * @export
 */
export const AccountApiFetchParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     * Gets NFT token transactions in descending order based on block number
     * @summary Gets NFT transfers of a ERC721 or ERC1155 token
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getHistoricalNFTTransfers(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getHistoricalNFTTransfers."
        );
      }
      const localVarPath = `/{address}/nft/transfers/verbose`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (subdomain !== undefined) {
        localVarQueryParameter["subdomain"] = subdomain;
      }

      if (providerUrl !== undefined) {
        localVarQueryParameter["providerUrl"] = providerUrl;
      }

      if (fromBlock !== undefined) {
        localVarQueryParameter["from_block"] = fromBlock;
      }

      if (toBlock !== undefined) {
        localVarQueryParameter["to_block"] = toBlock;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers to and from a given address
     * @param {string} address The sender or recepient of the transfer
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {string} [direction] The transfer direction
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;token_address\&quot;, \&quot;token_address.ASC\&quot;, \&quot;token_address.DESC\&quot;, Example 2: \&quot;token_address and token_id\&quot;, \&quot;token_address.ASC,token_id.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTTransfers(
      address: string,
      chain?: string,
      format?: string,
      direction?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getNFTTransfers."
        );
      }
      const localVarPath = `/{address}/nft/transfers`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      if (direction !== undefined) {
        localVarQueryParameter["direction"] = direction;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      if (order !== undefined) {
        localVarQueryParameter["order"] = order;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets NFTs owned by the given address * Use the token_address param to get results for a specific contract only * Note results will include all indexed NFTs * Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
     * @summary Gets the NFTs owned by a given address
     * @param {string} address The owner of a given token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTs(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getNFTs."
        );
      }
      const localVarPath = `/{address}/nft`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      if (order !== undefined) {
        localVarQueryParameter["order"] = order;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets NFTs owned by the given address * Use the token_address param to get results for a specific contract only * Note results will include all indexed NFTs * Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
     * @summary Gets the NFTs owned by a given address
     * @param {string} address The owner of a given token
     * @param {string} tokenAddress Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTsForContract(
      address: string,
      tokenAddress: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getNFTsForContract."
        );
      }
      // verify required parameter 'tokenAddress' is not null or undefined
      if (tokenAddress === null || tokenAddress === undefined) {
        throw new RequiredError(
          "tokenAddress",
          "Required parameter tokenAddress was null or undefined when calling getNFTsForContract."
        );
      }
      const localVarPath = `/{address}/nft/{token_address}`
        .replace(`{${"address"}}`, encodeURIComponent(String(address)))
        .replace(
          `{${"token_address"}}`,
          encodeURIComponent(String(tokenAddress))
        );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      if (order !== undefined) {
        localVarQueryParameter["order"] = order;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets native balance for a specific address
     * @summary Gets native balance for a specific address.
     * @param {string} address The address for which the native balance will be checked
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [toBlock] The block number on which the balances should be checked
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNativeBalance(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      toBlock?: number,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getNativeBalance."
        );
      }
      const localVarPath = `/{address}/balance`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (providerUrl !== undefined) {
        localVarQueryParameter["providerUrl"] = providerUrl;
      }

      if (toBlock !== undefined) {
        localVarQueryParameter["to_block"] = toBlock;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets token balances for a specific address
     * @summary Gets token balances for a specific address.
     * @param {string} address The address for which token balances will be checked
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [toBlock] The block number on which the balances should be checked
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenBalances(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      toBlock?: number,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getTokenBalances."
        );
      }
      const localVarPath = `/{address}/erc20`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (subdomain !== undefined) {
        localVarQueryParameter["subdomain"] = subdomain;
      }

      if (toBlock !== undefined) {
        localVarQueryParameter["to_block"] = toBlock;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets ERC20 token transactions in descending order based on block number
     * @summary Gets erc 20 token transactions
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenTransfers(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getTokenTransfers."
        );
      }
      const localVarPath = `/{address}/erc20/transfers`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (subdomain !== undefined) {
        localVarQueryParameter["subdomain"] = subdomain;
      }

      if (fromBlock !== undefined) {
        localVarQueryParameter["from_block"] = fromBlock;
      }

      if (toBlock !== undefined) {
        localVarQueryParameter["to_block"] = toBlock;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets native transactions in descending order based on block number
     * @summary Gets native transactions
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTransactions(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getTransactions."
        );
      }
      const localVarPath = `/{address}`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (subdomain !== undefined) {
        localVarQueryParameter["subdomain"] = subdomain;
      }

      if (fromBlock !== undefined) {
        localVarQueryParameter["from_block"] = fromBlock;
      }

      if (toBlock !== undefined) {
        localVarQueryParameter["to_block"] = toBlock;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * AccountApi - functional programming interface
 * @export
 */
export const AccountApiFp = function (configuration?: Configuration) {
  return {
    /**
     * Gets NFT token transactions in descending order based on block number
     * @summary Gets NFT transfers of a ERC721 or ERC1155 token
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getHistoricalNFTTransfers(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options?: any
    ): (
      fetch?: FetchAPI,
      basePath?: string
    ) => Promise<Array<HistoricalNftTransfer>> {
      const localVarFetchArgs = AccountApiFetchParamCreator(
        configuration
      ).getHistoricalNFTTransfers(
        address,
        chain,
        subdomain,
        providerUrl,
        fromBlock,
        toBlock,
        offset,
        limit,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers to and from a given address
     * @param {string} address The sender or recepient of the transfer
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {string} [direction] The transfer direction
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;token_address\&quot;, \&quot;token_address.ASC\&quot;, \&quot;token_address.DESC\&quot;, Example 2: \&quot;token_address and token_id\&quot;, \&quot;token_address.ASC,token_id.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTTransfers(
      address: string,
      chain?: string,
      format?: string,
      direction?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftTransferCollection> {
      const localVarFetchArgs = AccountApiFetchParamCreator(
        configuration
      ).getNFTTransfers(
        address,
        chain,
        format,
        direction,
        offset,
        limit,
        order,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets NFTs owned by the given address * Use the token_address param to get results for a specific contract only * Note results will include all indexed NFTs * Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
     * @summary Gets the NFTs owned by a given address
     * @param {string} address The owner of a given token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTs(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftOwnerCollection> {
      const localVarFetchArgs = AccountApiFetchParamCreator(
        configuration
      ).getNFTs(address, chain, format, offset, limit, order, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets NFTs owned by the given address * Use the token_address param to get results for a specific contract only * Note results will include all indexed NFTs * Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
     * @summary Gets the NFTs owned by a given address
     * @param {string} address The owner of a given token
     * @param {string} tokenAddress Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTsForContract(
      address: string,
      tokenAddress: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftOwnerCollection> {
      const localVarFetchArgs = AccountApiFetchParamCreator(
        configuration
      ).getNFTsForContract(
        address,
        tokenAddress,
        chain,
        format,
        offset,
        limit,
        order,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets native balance for a specific address
     * @summary Gets native balance for a specific address.
     * @param {string} address The address for which the native balance will be checked
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [toBlock] The block number on which the balances should be checked
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNativeBalance(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      toBlock?: number,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NativeBalance> {
      const localVarFetchArgs = AccountApiFetchParamCreator(
        configuration
      ).getNativeBalance(address, chain, providerUrl, toBlock, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets token balances for a specific address
     * @summary Gets token balances for a specific address.
     * @param {string} address The address for which token balances will be checked
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [toBlock] The block number on which the balances should be checked
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenBalances(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      toBlock?: number,
      options?: any
    ): (
      fetch?: FetchAPI,
      basePath?: string
    ) => Promise<Array<Erc20TokenBalance>> {
      const localVarFetchArgs = AccountApiFetchParamCreator(
        configuration
      ).getTokenBalances(address, chain, subdomain, toBlock, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets ERC20 token transactions in descending order based on block number
     * @summary Gets erc 20 token transactions
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenTransfers(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options?: any
    ): (
      fetch?: FetchAPI,
      basePath?: string
    ) => Promise<Array<Erc20Transaction>> {
      const localVarFetchArgs = AccountApiFetchParamCreator(
        configuration
      ).getTokenTransfers(
        address,
        chain,
        subdomain,
        fromBlock,
        toBlock,
        offset,
        limit,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets native transactions in descending order based on block number
     * @summary Gets native transactions
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTransactions(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<TransactionCollection> {
      const localVarFetchArgs = AccountApiFetchParamCreator(
        configuration
      ).getTransactions(
        address,
        chain,
        subdomain,
        fromBlock,
        toBlock,
        offset,
        limit,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
  };
};

/**
 * AccountApi - factory interface
 * @export
 */
export const AccountApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     * Gets NFT token transactions in descending order based on block number
     * @summary Gets NFT transfers of a ERC721 or ERC1155 token
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getHistoricalNFTTransfers(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options?: any
    ) {
      return AccountApiFp(configuration).getHistoricalNFTTransfers(
        address,
        chain,
        subdomain,
        providerUrl,
        fromBlock,
        toBlock,
        offset,
        limit,
        options
      )(fetch, basePath);
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers to and from a given address
     * @param {string} address The sender or recepient of the transfer
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {string} [direction] The transfer direction
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;token_address\&quot;, \&quot;token_address.ASC\&quot;, \&quot;token_address.DESC\&quot;, Example 2: \&quot;token_address and token_id\&quot;, \&quot;token_address.ASC,token_id.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTTransfers(
      address: string,
      chain?: string,
      format?: string,
      direction?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ) {
      return AccountApiFp(configuration).getNFTTransfers(
        address,
        chain,
        format,
        direction,
        offset,
        limit,
        order,
        options
      )(fetch, basePath);
    },
    /**
     * Gets NFTs owned by the given address * Use the token_address param to get results for a specific contract only * Note results will include all indexed NFTs * Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
     * @summary Gets the NFTs owned by a given address
     * @param {string} address The owner of a given token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTs(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ) {
      return AccountApiFp(configuration).getNFTs(
        address,
        chain,
        format,
        offset,
        limit,
        order,
        options
      )(fetch, basePath);
    },
    /**
     * Gets NFTs owned by the given address * Use the token_address param to get results for a specific contract only * Note results will include all indexed NFTs * Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
     * @summary Gets the NFTs owned by a given address
     * @param {string} address The owner of a given token
     * @param {string} tokenAddress Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTsForContract(
      address: string,
      tokenAddress: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ) {
      return AccountApiFp(configuration).getNFTsForContract(
        address,
        tokenAddress,
        chain,
        format,
        offset,
        limit,
        order,
        options
      )(fetch, basePath);
    },
    /**
     * Gets native balance for a specific address
     * @summary Gets native balance for a specific address.
     * @param {string} address The address for which the native balance will be checked
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [toBlock] The block number on which the balances should be checked
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNativeBalance(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      toBlock?: number,
      options?: any
    ) {
      return AccountApiFp(configuration).getNativeBalance(
        address,
        chain,
        providerUrl,
        toBlock,
        options
      )(fetch, basePath);
    },
    /**
     * Gets token balances for a specific address
     * @summary Gets token balances for a specific address.
     * @param {string} address The address for which token balances will be checked
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [toBlock] The block number on which the balances should be checked
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenBalances(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      toBlock?: number,
      options?: any
    ) {
      return AccountApiFp(configuration).getTokenBalances(
        address,
        chain,
        subdomain,
        toBlock,
        options
      )(fetch, basePath);
    },
    /**
     * Gets ERC20 token transactions in descending order based on block number
     * @summary Gets erc 20 token transactions
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenTransfers(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options?: any
    ) {
      return AccountApiFp(configuration).getTokenTransfers(
        address,
        chain,
        subdomain,
        fromBlock,
        toBlock,
        offset,
        limit,
        options
      )(fetch, basePath);
    },
    /**
     * Gets native transactions in descending order based on block number
     * @summary Gets native transactions
     * @param {string} address address
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTransactions(
      address: string,
      chain?: ChainList,
      subdomain?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options?: any
    ) {
      return AccountApiFp(configuration).getTransactions(
        address,
        chain,
        subdomain,
        fromBlock,
        toBlock,
        offset,
        limit,
        options
      )(fetch, basePath);
    },
  };
};

/**
 * AccountApi - object-oriented interface
 * @export
 * @class AccountApi
 * @extends {BaseAPI}
 */
export class AccountApi extends BaseAPI {
  /**
   * Gets NFT token transactions in descending order based on block number
   * @summary Gets NFT transfers of a ERC721 or ERC1155 token
   * @param {string} address address
   * @param {ChainList} [chain] The chain to query
   * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
   * @param {string} [providerUrl] web3 provider url to user when using local dev chain
   * @param {number} [fromBlock] from_block
   * @param {number} [toBlock] to_block
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof AccountApi
   */
  public getHistoricalNFTTransfers(
    address: string,
    chain?: ChainList,
    subdomain?: string,
    providerUrl?: string,
    fromBlock?: number,
    toBlock?: number,
    offset?: number,
    limit?: number,
    options?: any
  ) {
    return AccountApiFp(this.configuration).getHistoricalNFTTransfers(
      address,
      chain,
      subdomain,
      providerUrl,
      fromBlock,
      toBlock,
      offset,
      limit,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets the transfers of the tokens matching the given parameters
   * @summary Gets NFT transfers to and from a given address
   * @param {string} address The sender or recepient of the transfer
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {string} [direction] The transfer direction
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;token_address\&quot;, \&quot;token_address.ASC\&quot;, \&quot;token_address.DESC\&quot;, Example 2: \&quot;token_address and token_id\&quot;, \&quot;token_address.ASC,token_id.DESC\&quot;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof AccountApi
   */
  public getNFTTransfers(
    address: string,
    chain?: string,
    format?: string,
    direction?: string,
    offset?: number,
    limit?: number,
    order?: string,
    options?: any
  ) {
    return AccountApiFp(this.configuration).getNFTTransfers(
      address,
      chain,
      format,
      direction,
      offset,
      limit,
      order,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets NFTs owned by the given address * Use the token_address param to get results for a specific contract only * Note results will include all indexed NFTs * Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
   * @summary Gets the NFTs owned by a given address
   * @param {string} address The owner of a given token
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof AccountApi
   */
  public getNFTs(
    address: string,
    chain?: string,
    format?: string,
    offset?: number,
    limit?: number,
    order?: string,
    options?: any
  ) {
    return AccountApiFp(this.configuration).getNFTs(
      address,
      chain,
      format,
      offset,
      limit,
      order,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets NFTs owned by the given address * Use the token_address param to get results for a specific contract only * Note results will include all indexed NFTs * Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
   * @summary Gets the NFTs owned by a given address
   * @param {string} address The owner of a given token
   * @param {string} tokenAddress Address of the contract
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof AccountApi
   */
  public getNFTsForContract(
    address: string,
    tokenAddress: string,
    chain?: string,
    format?: string,
    offset?: number,
    limit?: number,
    order?: string,
    options?: any
  ) {
    return AccountApiFp(this.configuration).getNFTsForContract(
      address,
      tokenAddress,
      chain,
      format,
      offset,
      limit,
      order,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets native balance for a specific address
   * @summary Gets native balance for a specific address.
   * @param {string} address The address for which the native balance will be checked
   * @param {ChainList} [chain] The chain to query
   * @param {string} [providerUrl] web3 provider url to user when using local dev chain
   * @param {number} [toBlock] The block number on which the balances should be checked
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof AccountApi
   */
  public getNativeBalance(
    address: string,
    chain?: ChainList,
    providerUrl?: string,
    toBlock?: number,
    options?: any
  ) {
    return AccountApiFp(this.configuration).getNativeBalance(
      address,
      chain,
      providerUrl,
      toBlock,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets token balances for a specific address
   * @summary Gets token balances for a specific address.
   * @param {string} address The address for which token balances will be checked
   * @param {ChainList} [chain] The chain to query
   * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
   * @param {number} [toBlock] The block number on which the balances should be checked
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof AccountApi
   */
  public getTokenBalances(
    address: string,
    chain?: ChainList,
    subdomain?: string,
    toBlock?: number,
    options?: any
  ) {
    return AccountApiFp(this.configuration).getTokenBalances(
      address,
      chain,
      subdomain,
      toBlock,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets ERC20 token transactions in descending order based on block number
   * @summary Gets erc 20 token transactions
   * @param {string} address address
   * @param {ChainList} [chain] The chain to query
   * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
   * @param {number} [fromBlock] from_block
   * @param {number} [toBlock] to_block
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof AccountApi
   */
  public getTokenTransfers(
    address: string,
    chain?: ChainList,
    subdomain?: string,
    fromBlock?: number,
    toBlock?: number,
    offset?: number,
    limit?: number,
    options?: any
  ) {
    return AccountApiFp(this.configuration).getTokenTransfers(
      address,
      chain,
      subdomain,
      fromBlock,
      toBlock,
      offset,
      limit,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets native transactions in descending order based on block number
   * @summary Gets native transactions
   * @param {string} address address
   * @param {ChainList} [chain] The chain to query
   * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
   * @param {number} [fromBlock] from_block
   * @param {number} [toBlock] to_block
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof AccountApi
   */
  public getTransactions(
    address: string,
    chain?: ChainList,
    subdomain?: string,
    fromBlock?: number,
    toBlock?: number,
    offset?: number,
    limit?: number,
    options?: any
  ) {
    return AccountApiFp(this.configuration).getTransactions(
      address,
      chain,
      subdomain,
      fromBlock,
      toBlock,
      offset,
      limit,
      options
    )(this.fetch, this.basePath);
  }
}
/**
 * NativeApi - fetch parameter creator
 * @export
 */
export const NativeApiFetchParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     * Gets the contents of a block by block hash
     * @summary Gets block contents by block hash
     * @param {string} blockNumberOrHash The block hash or block number
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getBlock(
      blockNumberOrHash: string,
      chain?: ChainList,
      subdomain?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'blockNumberOrHash' is not null or undefined
      if (blockNumberOrHash === null || blockNumberOrHash === undefined) {
        throw new RequiredError(
          "blockNumberOrHash",
          "Required parameter blockNumberOrHash was null or undefined when calling getBlock."
        );
      }
      const localVarPath = `/block/{block_number_or_hash}`.replace(
        `{${"block_number_or_hash"}}`,
        encodeURIComponent(String(blockNumberOrHash))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (subdomain !== undefined) {
        localVarQueryParameter["subdomain"] = subdomain;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets events in descending order based on block number
     * @summary Gets events by topic
     * @param {any} body Optional description in *Markdown*
     * @param {string} address address
     * @param {string} topic The topic of the event
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getContractEvents(
      body: any,
      address: string,
      topic: string,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'body' is not null or undefined
      if (body === null || body === undefined) {
        throw new RequiredError(
          "body",
          "Required parameter body was null or undefined when calling getContractEvents."
        );
      }
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getContractEvents."
        );
      }
      // verify required parameter 'topic' is not null or undefined
      if (topic === null || topic === undefined) {
        throw new RequiredError(
          "topic",
          "Required parameter topic was null or undefined when calling getContractEvents."
        );
      }
      const localVarPath = `/{address}/events`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "POST" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (subdomain !== undefined) {
        localVarQueryParameter["subdomain"] = subdomain;
      }

      if (providerUrl !== undefined) {
        localVarQueryParameter["providerUrl"] = providerUrl;
      }

      if (fromBlock !== undefined) {
        localVarQueryParameter["from_block"] = fromBlock;
      }

      if (toBlock !== undefined) {
        localVarQueryParameter["to_block"] = toBlock;
      }

      if (topic !== undefined) {
        localVarQueryParameter["topic"] = topic;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      localVarHeaderParameter["Content-Type"] = "application/json";

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );
      const needsSerialization =
        <any>"any" !== "string" ||
        localVarRequestOptions.headers["Content-Type"] === "application/json";
      localVarRequestOptions.body = needsSerialization
        ? JSON.stringify(body || {})
        : body || "";

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * NativeApi - functional programming interface
 * @export
 */
export const NativeApiFp = function (configuration?: Configuration) {
  return {
    /**
     * Gets the contents of a block by block hash
     * @summary Gets block contents by block hash
     * @param {string} blockNumberOrHash The block hash or block number
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getBlock(
      blockNumberOrHash: string,
      chain?: ChainList,
      subdomain?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Block> {
      const localVarFetchArgs = NativeApiFetchParamCreator(
        configuration
      ).getBlock(blockNumberOrHash, chain, subdomain, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets events in descending order based on block number
     * @summary Gets events by topic
     * @param {any} body Optional description in *Markdown*
     * @param {string} address address
     * @param {string} topic The topic of the event
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getContractEvents(
      body: any,
      address: string,
      topic: string,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Array<LogEvent>> {
      const localVarFetchArgs = NativeApiFetchParamCreator(
        configuration
      ).getContractEvents(
        body,
        address,
        topic,
        chain,
        subdomain,
        providerUrl,
        fromBlock,
        toBlock,
        offset,
        limit,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
  };
};

/**
 * NativeApi - factory interface
 * @export
 */
export const NativeApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     * Gets the contents of a block by block hash
     * @summary Gets block contents by block hash
     * @param {string} blockNumberOrHash The block hash or block number
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getBlock(
      blockNumberOrHash: string,
      chain?: ChainList,
      subdomain?: string,
      options?: any
    ) {
      return NativeApiFp(configuration).getBlock(
        blockNumberOrHash,
        chain,
        subdomain,
        options
      )(fetch, basePath);
    },
    /**
     * Gets events in descending order based on block number
     * @summary Gets events by topic
     * @param {any} body Optional description in *Markdown*
     * @param {string} address address
     * @param {string} topic The topic of the event
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {number} [fromBlock] from_block
     * @param {number} [toBlock] to_block
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getContractEvents(
      body: any,
      address: string,
      topic: string,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      fromBlock?: number,
      toBlock?: number,
      offset?: number,
      limit?: number,
      options?: any
    ) {
      return NativeApiFp(configuration).getContractEvents(
        body,
        address,
        topic,
        chain,
        subdomain,
        providerUrl,
        fromBlock,
        toBlock,
        offset,
        limit,
        options
      )(fetch, basePath);
    },
  };
};

/**
 * NativeApi - object-oriented interface
 * @export
 * @class NativeApi
 * @extends {BaseAPI}
 */
export class NativeApi extends BaseAPI {
  /**
   * Gets the contents of a block by block hash
   * @summary Gets block contents by block hash
   * @param {string} blockNumberOrHash The block hash or block number
   * @param {ChainList} [chain] The chain to query
   * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof NativeApi
   */
  public getBlock(
    blockNumberOrHash: string,
    chain?: ChainList,
    subdomain?: string,
    options?: any
  ) {
    return NativeApiFp(this.configuration).getBlock(
      blockNumberOrHash,
      chain,
      subdomain,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets events in descending order based on block number
   * @summary Gets events by topic
   * @param {any} body Optional description in *Markdown*
   * @param {string} address address
   * @param {string} topic The topic of the event
   * @param {ChainList} [chain] The chain to query
   * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
   * @param {string} [providerUrl] web3 provider url to user when using local dev chain
   * @param {number} [fromBlock] from_block
   * @param {number} [toBlock] to_block
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof NativeApi
   */
  public getContractEvents(
    body: any,
    address: string,
    topic: string,
    chain?: ChainList,
    subdomain?: string,
    providerUrl?: string,
    fromBlock?: number,
    toBlock?: number,
    offset?: number,
    limit?: number,
    options?: any
  ) {
    return NativeApiFp(this.configuration).getContractEvents(
      body,
      address,
      topic,
      chain,
      subdomain,
      providerUrl,
      fromBlock,
      toBlock,
      offset,
      limit,
      options
    )(this.fetch, this.basePath);
  }
}
/**
 * ResolveApi - fetch parameter creator
 * @export
 */
export const ResolveApiFetchParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     * Resolves an Unstoppable domain and returns the address
     * @summary Resolves an Unstoppable domain and returns the address
     * @param {string} domain Domain to be resolved
     * @param {string} [currency] The currency to query
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    resolveDomain(
      domain: string,
      currency?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'domain' is not null or undefined
      if (domain === null || domain === undefined) {
        throw new RequiredError(
          "domain",
          "Required parameter domain was null or undefined when calling resolveDomain."
        );
      }
      const localVarPath = `/resolve/{domain}`.replace(
        `{${"domain"}}`,
        encodeURIComponent(String(domain))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (currency !== undefined) {
        localVarQueryParameter["currency"] = currency;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * ResolveApi - functional programming interface
 * @export
 */
export const ResolveApiFp = function (configuration?: Configuration) {
  return {
    /**
     * Resolves an Unstoppable domain and returns the address
     * @summary Resolves an Unstoppable domain and returns the address
     * @param {string} domain Domain to be resolved
     * @param {string} [currency] The currency to query
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    resolveDomain(
      domain: string,
      currency?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Resolve> {
      const localVarFetchArgs = ResolveApiFetchParamCreator(
        configuration
      ).resolveDomain(domain, currency, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
  };
};

/**
 * ResolveApi - factory interface
 * @export
 */
export const ResolveApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     * Resolves an Unstoppable domain and returns the address
     * @summary Resolves an Unstoppable domain and returns the address
     * @param {string} domain Domain to be resolved
     * @param {string} [currency] The currency to query
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    resolveDomain(domain: string, currency?: string, options?: any) {
      return ResolveApiFp(configuration).resolveDomain(
        domain,
        currency,
        options
      )(fetch, basePath);
    },
  };
};

/**
 * ResolveApi - object-oriented interface
 * @export
 * @class ResolveApi
 * @extends {BaseAPI}
 */
export class ResolveApi extends BaseAPI {
  /**
   * Resolves an Unstoppable domain and returns the address
   * @summary Resolves an Unstoppable domain and returns the address
   * @param {string} domain Domain to be resolved
   * @param {string} [currency] The currency to query
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof ResolveApi
   */
  public resolveDomain(domain: string, currency?: string, options?: any) {
    return ResolveApiFp(this.configuration).resolveDomain(
      domain,
      currency,
      options
    )(this.fetch, this.basePath);
  }
}
/**
 * TokenApi - fetch parameter creator
 * @export
 */
export const TokenApiFetchParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     * Gets data, including metadata (where available), for all token ids for the given contract address. * Results are sorted by the block the token id was minted (descending) and limited to 100 per page by default * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Retrieves the unique NFTs inside a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] If the order should be Ascending or Descending based on the blocknumber on which the NFT was minted. Allowed values: \&quot;ASC\&quot;, \&quot;DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getAllTokenIds(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getAllTokenIds."
        );
      }
      const localVarPath = `/nft/{address}`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      if (order !== undefined) {
        localVarQueryParameter["order"] = order;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers of a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;block_number\&quot;, \&quot;block_number.ASC\&quot;, \&quot;block_number.DESC\&quot;, Example 2: \&quot;block_number and contract_type\&quot;, \&quot;block_number.ASC,contract_type.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getContractNFTTransfers(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getContractNFTTransfers."
        );
      }
      const localVarPath = `/nft/{address}/transfers`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      if (order !== undefined) {
        localVarQueryParameter["order"] = order;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Returns metadata (name, symbol) for a given token contract address.
     * @summary Gets token metadata
     * @param {string} address The address of the token contract
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getERC721Metadata(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getERC721Metadata."
        );
      }
      const localVarPath = `/erc721/{address}/metadata`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (providerUrl !== undefined) {
        localVarQueryParameter["providerUrl"] = providerUrl;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets the contract level metadata (name, symbol, base token uri) for the given contract * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the global metadata for a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTMetadata(
      address: string,
      chain?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getNFTMetadata."
        );
      }
      const localVarPath = `/nft/{address}/metadata`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets all owners of NFT items within a given contract collection * Use after /nft/contract/{token_address} to find out who owns each token id in a collection * Make sure to include a sort parm on a column like block_number_minted for consistent pagination results * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the owners of the NFTs of a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTOwners(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getNFTOwners."
        );
      }
      const localVarPath = `/nft/{address}/owners`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      if (order !== undefined) {
        localVarQueryParameter["order"] = order;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets the amount which the spender is allowed to withdraw from the spender
     * @summary Gets the amount which the spender is allowed to withdraw from the owner.
     * @param {string} address The address of the token contract
     * @param {string} ownerAddress The address of the token owner
     * @param {string} spenderAddress The address of the token spender
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenAllowance(
      address: string,
      ownerAddress: string,
      spenderAddress: string,
      chain?: ChainList,
      providerUrl?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getTokenAllowance."
        );
      }
      // verify required parameter 'ownerAddress' is not null or undefined
      if (ownerAddress === null || ownerAddress === undefined) {
        throw new RequiredError(
          "ownerAddress",
          "Required parameter ownerAddress was null or undefined when calling getTokenAllowance."
        );
      }
      // verify required parameter 'spenderAddress' is not null or undefined
      if (spenderAddress === null || spenderAddress === undefined) {
        throw new RequiredError(
          "spenderAddress",
          "Required parameter spenderAddress was null or undefined when calling getTokenAllowance."
        );
      }
      const localVarPath = `/erc20/{address}/allowance`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (providerUrl !== undefined) {
        localVarQueryParameter["providerUrl"] = providerUrl;
      }

      if (ownerAddress !== undefined) {
        localVarQueryParameter["owner_address"] = ownerAddress;
      }

      if (spenderAddress !== undefined) {
        localVarQueryParameter["spender_address"] = spenderAddress;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets data, including metadata (where available), for the given token id of the given contract address. * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the NFT with the given id of a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenIdMetadata(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getTokenIdMetadata."
        );
      }
      // verify required parameter 'tokenId' is not null or undefined
      if (tokenId === null || tokenId === undefined) {
        throw new RequiredError(
          "tokenId",
          "Required parameter tokenId was null or undefined when calling getTokenIdMetadata."
        );
      }
      const localVarPath = `/nft/{address}/{token_id}`
        .replace(`{${"address"}}`, encodeURIComponent(String(address)))
        .replace(`{${"token_id"}}`, encodeURIComponent(String(tokenId)));
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets all owners of NFT items within a given contract collection * Use after /nft/contract/{token_address} to find out who owns each token id in a collection * Make sure to include a sort parm on a column like block_number_minted for consistent pagination results * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the owners of NFTs for a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenIdOwners(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getTokenIdOwners."
        );
      }
      // verify required parameter 'tokenId' is not null or undefined
      if (tokenId === null || tokenId === undefined) {
        throw new RequiredError(
          "tokenId",
          "Required parameter tokenId was null or undefined when calling getTokenIdOwners."
        );
      }
      const localVarPath = `/nft/{address}/{token_id}/owners`
        .replace(`{${"address"}}`, encodeURIComponent(String(address)))
        .replace(`{${"token_id"}}`, encodeURIComponent(String(tokenId)));
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      if (order !== undefined) {
        localVarQueryParameter["order"] = order;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Returns metadata (name, symbol, decimals, logo) for a given token contract address.
     * @summary Gets token metadata
     * @param {Array<string>} addresses The addresses to get metadata for
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenMetadata(
      addresses: Array<string>,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'addresses' is not null or undefined
      if (addresses === null || addresses === undefined) {
        throw new RequiredError(
          "addresses",
          "Required parameter addresses was null or undefined when calling getTokenMetadata."
        );
      }
      const localVarPath = `/erc20/metadata`;
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (subdomain !== undefined) {
        localVarQueryParameter["subdomain"] = subdomain;
      }

      if (providerUrl !== undefined) {
        localVarQueryParameter["providerUrl"] = providerUrl;
      }

      if (addresses) {
        localVarQueryParameter["addresses"] = addresses;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Returns metadata (name, symbol, decimals, logo) for a given token contract address.
     * @summary Gets token metadata
     * @param {Array<string>} symbols The symbols to get metadata for
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenMetadataBySymbol(
      symbols: Array<string>,
      chain?: ChainList,
      subdomain?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'symbols' is not null or undefined
      if (symbols === null || symbols === undefined) {
        throw new RequiredError(
          "symbols",
          "Required parameter symbols was null or undefined when calling getTokenMetadataBySymbol."
        );
      }
      const localVarPath = `/erc20/metadata/symbols`;
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (subdomain !== undefined) {
        localVarQueryParameter["subdomain"] = subdomain;
      }

      if (symbols) {
        localVarQueryParameter["symbols"] = symbols;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Returns the price nominated in the native token and usd for a given token contract address.
     * @summary Gets token price
     * @param {string} address The address of the token contract
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {string} [exchange] The factory name or address of the token exchange
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenPrice(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      exchange?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getTokenPrice."
        );
      }
      const localVarPath = `/erc20/{address}/price`.replace(
        `{${"address"}}`,
        encodeURIComponent(String(address))
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (providerUrl !== undefined) {
        localVarQueryParameter["providerUrl"] = providerUrl;
      }

      if (exchange !== undefined) {
        localVarQueryParameter["exchange"] = exchange;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers of a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;block_number\&quot;, \&quot;block_number.ASC\&quot;, \&quot;block_number.DESC\&quot;, Example 2: \&quot;block_number and contract_type\&quot;, \&quot;block_number.ASC,contract_type.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWalletTokenIdTransfers(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'address' is not null or undefined
      if (address === null || address === undefined) {
        throw new RequiredError(
          "address",
          "Required parameter address was null or undefined when calling getWalletTokenIdTransfers."
        );
      }
      // verify required parameter 'tokenId' is not null or undefined
      if (tokenId === null || tokenId === undefined) {
        throw new RequiredError(
          "tokenId",
          "Required parameter tokenId was null or undefined when calling getWalletTokenIdTransfers."
        );
      }
      const localVarPath = `/nft/{address}/{token_id}/transfers`
        .replace(`{${"address"}}`, encodeURIComponent(String(address)))
        .replace(`{${"token_id"}}`, encodeURIComponent(String(tokenId)));
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: "GET" }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication ApiKeyAuth required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === "function"
            ? configuration.apiKey("X-API-Key")
            : configuration.apiKey;
        localVarHeaderParameter["X-API-Key"] = localVarApiKeyValue;
      }

      if (chain !== undefined) {
        localVarQueryParameter["chain"] = chain;
      }

      if (format !== undefined) {
        localVarQueryParameter["format"] = format;
      }

      if (offset !== undefined) {
        localVarQueryParameter["offset"] = offset;
      }

      if (limit !== undefined) {
        localVarQueryParameter["limit"] = limit;
      }

      if (order !== undefined) {
        localVarQueryParameter["order"] = order;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * TokenApi - functional programming interface
 * @export
 */
export const TokenApiFp = function (configuration?: Configuration) {
  return {
    /**
     * Gets data, including metadata (where available), for all token ids for the given contract address. * Results are sorted by the block the token id was minted (descending) and limited to 100 per page by default * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Retrieves the unique NFTs inside a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] If the order should be Ascending or Descending based on the blocknumber on which the NFT was minted. Allowed values: \&quot;ASC\&quot;, \&quot;DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getAllTokenIds(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftCollection> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getAllTokenIds(address, chain, format, offset, limit, order, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers of a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;block_number\&quot;, \&quot;block_number.ASC\&quot;, \&quot;block_number.DESC\&quot;, Example 2: \&quot;block_number and contract_type\&quot;, \&quot;block_number.ASC,contract_type.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getContractNFTTransfers(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftTransferCollection> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getContractNFTTransfers(
        address,
        chain,
        format,
        offset,
        limit,
        order,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Returns metadata (name, symbol) for a given token contract address.
     * @summary Gets token metadata
     * @param {string} address The address of the token contract
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getERC721Metadata(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Array<Erc721Metadata>> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getERC721Metadata(address, chain, providerUrl, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets the contract level metadata (name, symbol, base token uri) for the given contract * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the global metadata for a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTMetadata(
      address: string,
      chain?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftContractMetadata> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getNFTMetadata(address, chain, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets all owners of NFT items within a given contract collection * Use after /nft/contract/{token_address} to find out who owns each token id in a collection * Make sure to include a sort parm on a column like block_number_minted for consistent pagination results * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the owners of the NFTs of a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTOwners(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftOwnerCollection> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getNFTOwners(address, chain, format, offset, limit, order, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets the amount which the spender is allowed to withdraw from the spender
     * @summary Gets the amount which the spender is allowed to withdraw from the owner.
     * @param {string} address The address of the token contract
     * @param {string} ownerAddress The address of the token owner
     * @param {string} spenderAddress The address of the token spender
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenAllowance(
      address: string,
      ownerAddress: string,
      spenderAddress: string,
      chain?: ChainList,
      providerUrl?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Erc20Allowance> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getTokenAllowance(
        address,
        ownerAddress,
        spenderAddress,
        chain,
        providerUrl,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets data, including metadata (where available), for the given token id of the given contract address. * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the NFT with the given id of a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenIdMetadata(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Nft> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getTokenIdMetadata(address, tokenId, chain, format, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets all owners of NFT items within a given contract collection * Use after /nft/contract/{token_address} to find out who owns each token id in a collection * Make sure to include a sort parm on a column like block_number_minted for consistent pagination results * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the owners of NFTs for a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenIdOwners(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftOwnerCollection> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getTokenIdOwners(
        address,
        tokenId,
        chain,
        format,
        offset,
        limit,
        order,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Returns metadata (name, symbol, decimals, logo) for a given token contract address.
     * @summary Gets token metadata
     * @param {Array<string>} addresses The addresses to get metadata for
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenMetadata(
      addresses: Array<string>,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Array<Erc20Metadata>> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getTokenMetadata(addresses, chain, subdomain, providerUrl, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Returns metadata (name, symbol, decimals, logo) for a given token contract address.
     * @summary Gets token metadata
     * @param {Array<string>} symbols The symbols to get metadata for
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenMetadataBySymbol(
      symbols: Array<string>,
      chain?: ChainList,
      subdomain?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Array<Erc20Metadata>> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getTokenMetadataBySymbol(symbols, chain, subdomain, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Returns the price nominated in the native token and usd for a given token contract address.
     * @summary Gets token price
     * @param {string} address The address of the token contract
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {string} [exchange] The factory name or address of the token exchange
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenPrice(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      exchange?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Erc20Price> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getTokenPrice(address, chain, providerUrl, exchange, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers of a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;block_number\&quot;, \&quot;block_number.ASC\&quot;, \&quot;block_number.DESC\&quot;, Example 2: \&quot;block_number and contract_type\&quot;, \&quot;block_number.ASC,contract_type.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWalletTokenIdTransfers(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<NftTransferCollection> {
      const localVarFetchArgs = TokenApiFetchParamCreator(
        configuration
      ).getWalletTokenIdTransfers(
        address,
        tokenId,
        chain,
        format,
        offset,
        limit,
        order,
        options
      );
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
  };
};

/**
 * TokenApi - factory interface
 * @export
 */
export const TokenApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     * Gets data, including metadata (where available), for all token ids for the given contract address. * Results are sorted by the block the token id was minted (descending) and limited to 100 per page by default * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Retrieves the unique NFTs inside a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] If the order should be Ascending or Descending based on the blocknumber on which the NFT was minted. Allowed values: \&quot;ASC\&quot;, \&quot;DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getAllTokenIds(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getAllTokenIds(
        address,
        chain,
        format,
        offset,
        limit,
        order,
        options
      )(fetch, basePath);
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers of a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;block_number\&quot;, \&quot;block_number.ASC\&quot;, \&quot;block_number.DESC\&quot;, Example 2: \&quot;block_number and contract_type\&quot;, \&quot;block_number.ASC,contract_type.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getContractNFTTransfers(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getContractNFTTransfers(
        address,
        chain,
        format,
        offset,
        limit,
        order,
        options
      )(fetch, basePath);
    },
    /**
     * Returns metadata (name, symbol) for a given token contract address.
     * @summary Gets token metadata
     * @param {string} address The address of the token contract
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getERC721Metadata(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getERC721Metadata(
        address,
        chain,
        providerUrl,
        options
      )(fetch, basePath);
    },
    /**
     * Gets the contract level metadata (name, symbol, base token uri) for the given contract * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the global metadata for a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTMetadata(address: string, chain?: string, options?: any) {
      return TokenApiFp(configuration).getNFTMetadata(
        address,
        chain,
        options
      )(fetch, basePath);
    },
    /**
     * Gets all owners of NFT items within a given contract collection * Use after /nft/contract/{token_address} to find out who owns each token id in a collection * Make sure to include a sort parm on a column like block_number_minted for consistent pagination results * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the owners of the NFTs of a given contract
     * @param {string} address Address of the contract
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getNFTOwners(
      address: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getNFTOwners(
        address,
        chain,
        format,
        offset,
        limit,
        order,
        options
      )(fetch, basePath);
    },
    /**
     * Gets the amount which the spender is allowed to withdraw from the spender
     * @summary Gets the amount which the spender is allowed to withdraw from the owner.
     * @param {string} address The address of the token contract
     * @param {string} ownerAddress The address of the token owner
     * @param {string} spenderAddress The address of the token spender
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenAllowance(
      address: string,
      ownerAddress: string,
      spenderAddress: string,
      chain?: ChainList,
      providerUrl?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getTokenAllowance(
        address,
        ownerAddress,
        spenderAddress,
        chain,
        providerUrl,
        options
      )(fetch, basePath);
    },
    /**
     * Gets data, including metadata (where available), for the given token id of the given contract address. * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the NFT with the given id of a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenIdMetadata(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getTokenIdMetadata(
        address,
        tokenId,
        chain,
        format,
        options
      )(fetch, basePath);
    },
    /**
     * Gets all owners of NFT items within a given contract collection * Use after /nft/contract/{token_address} to find out who owns each token id in a collection * Make sure to include a sort parm on a column like block_number_minted for consistent pagination results * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
     * @summary Gets the owners of NFTs for a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenIdOwners(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getTokenIdOwners(
        address,
        tokenId,
        chain,
        format,
        offset,
        limit,
        order,
        options
      )(fetch, basePath);
    },
    /**
     * Returns metadata (name, symbol, decimals, logo) for a given token contract address.
     * @summary Gets token metadata
     * @param {Array<string>} addresses The addresses to get metadata for
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenMetadata(
      addresses: Array<string>,
      chain?: ChainList,
      subdomain?: string,
      providerUrl?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getTokenMetadata(
        addresses,
        chain,
        subdomain,
        providerUrl,
        options
      )(fetch, basePath);
    },
    /**
     * Returns metadata (name, symbol, decimals, logo) for a given token contract address.
     * @summary Gets token metadata
     * @param {Array<string>} symbols The symbols to get metadata for
     * @param {ChainList} [chain] The chain to query
     * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenMetadataBySymbol(
      symbols: Array<string>,
      chain?: ChainList,
      subdomain?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getTokenMetadataBySymbol(
        symbols,
        chain,
        subdomain,
        options
      )(fetch, basePath);
    },
    /**
     * Returns the price nominated in the native token and usd for a given token contract address.
     * @summary Gets token price
     * @param {string} address The address of the token contract
     * @param {ChainList} [chain] The chain to query
     * @param {string} [providerUrl] web3 provider url to user when using local dev chain
     * @param {string} [exchange] The factory name or address of the token exchange
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getTokenPrice(
      address: string,
      chain?: ChainList,
      providerUrl?: string,
      exchange?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getTokenPrice(
        address,
        chain,
        providerUrl,
        exchange,
        options
      )(fetch, basePath);
    },
    /**
     * Gets the transfers of the tokens matching the given parameters
     * @summary Gets NFT transfers of a given contract
     * @param {string} address Address of the contract
     * @param {string} tokenId The id of the token
     * @param {string} [chain] The chain to query
     * @param {string} [format] The format of the token id
     * @param {number} [offset] offset
     * @param {number} [limit] limit
     * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;block_number\&quot;, \&quot;block_number.ASC\&quot;, \&quot;block_number.DESC\&quot;, Example 2: \&quot;block_number and contract_type\&quot;, \&quot;block_number.ASC,contract_type.DESC\&quot;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWalletTokenIdTransfers(
      address: string,
      tokenId: string,
      chain?: string,
      format?: string,
      offset?: number,
      limit?: number,
      order?: string,
      options?: any
    ) {
      return TokenApiFp(configuration).getWalletTokenIdTransfers(
        address,
        tokenId,
        chain,
        format,
        offset,
        limit,
        order,
        options
      )(fetch, basePath);
    },
  };
};

/**
 * TokenApi - object-oriented interface
 * @export
 * @class TokenApi
 * @extends {BaseAPI}
 */
export class TokenApi extends BaseAPI {
  /**
   * Gets data, including metadata (where available), for all token ids for the given contract address. * Results are sorted by the block the token id was minted (descending) and limited to 100 per page by default * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
   * @summary Retrieves the unique NFTs inside a given contract
   * @param {string} address Address of the contract
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {string} [order] If the order should be Ascending or Descending based on the blocknumber on which the NFT was minted. Allowed values: \&quot;ASC\&quot;, \&quot;DESC\&quot;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getAllTokenIds(
    address: string,
    chain?: string,
    format?: string,
    offset?: number,
    limit?: number,
    order?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getAllTokenIds(
      address,
      chain,
      format,
      offset,
      limit,
      order,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets the transfers of the tokens matching the given parameters
   * @summary Gets NFT transfers of a given contract
   * @param {string} address Address of the contract
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;block_number\&quot;, \&quot;block_number.ASC\&quot;, \&quot;block_number.DESC\&quot;, Example 2: \&quot;block_number and contract_type\&quot;, \&quot;block_number.ASC,contract_type.DESC\&quot;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getContractNFTTransfers(
    address: string,
    chain?: string,
    format?: string,
    offset?: number,
    limit?: number,
    order?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getContractNFTTransfers(
      address,
      chain,
      format,
      offset,
      limit,
      order,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Returns metadata (name, symbol) for a given token contract address.
   * @summary Gets token metadata
   * @param {string} address The address of the token contract
   * @param {ChainList} [chain] The chain to query
   * @param {string} [providerUrl] web3 provider url to user when using local dev chain
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getERC721Metadata(
    address: string,
    chain?: ChainList,
    providerUrl?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getERC721Metadata(
      address,
      chain,
      providerUrl,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets the contract level metadata (name, symbol, base token uri) for the given contract * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
   * @summary Gets the global metadata for a given contract
   * @param {string} address Address of the contract
   * @param {string} [chain] The chain to query
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getNFTMetadata(address: string, chain?: string, options?: any) {
    return TokenApiFp(this.configuration).getNFTMetadata(
      address,
      chain,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets all owners of NFT items within a given contract collection * Use after /nft/contract/{token_address} to find out who owns each token id in a collection * Make sure to include a sort parm on a column like block_number_minted for consistent pagination results * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
   * @summary Gets the owners of the NFTs of a given contract
   * @param {string} address Address of the contract
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getNFTOwners(
    address: string,
    chain?: string,
    format?: string,
    offset?: number,
    limit?: number,
    order?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getNFTOwners(
      address,
      chain,
      format,
      offset,
      limit,
      order,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets the amount which the spender is allowed to withdraw from the spender
   * @summary Gets the amount which the spender is allowed to withdraw from the owner.
   * @param {string} address The address of the token contract
   * @param {string} ownerAddress The address of the token owner
   * @param {string} spenderAddress The address of the token spender
   * @param {ChainList} [chain] The chain to query
   * @param {string} [providerUrl] web3 provider url to user when using local dev chain
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getTokenAllowance(
    address: string,
    ownerAddress: string,
    spenderAddress: string,
    chain?: ChainList,
    providerUrl?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getTokenAllowance(
      address,
      ownerAddress,
      spenderAddress,
      chain,
      providerUrl,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets data, including metadata (where available), for the given token id of the given contract address. * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
   * @summary Gets the NFT with the given id of a given contract
   * @param {string} address Address of the contract
   * @param {string} tokenId The id of the token
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getTokenIdMetadata(
    address: string,
    tokenId: string,
    chain?: string,
    format?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getTokenIdMetadata(
      address,
      tokenId,
      chain,
      format,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets all owners of NFT items within a given contract collection * Use after /nft/contract/{token_address} to find out who owns each token id in a collection * Make sure to include a sort parm on a column like block_number_minted for consistent pagination results * Requests for contract addresses not yet indexed will automatically start the indexing process for that NFT collection
   * @summary Gets the owners of NFTs for a given contract
   * @param {string} address Address of the contract
   * @param {string} tokenId The id of the token
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;name\&quot;, \&quot;name.ASC\&quot;, \&quot;name.DESC\&quot;, Example 2: \&quot;Name and Symbol\&quot;, \&quot;name.ASC,symbol.DESC\&quot;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getTokenIdOwners(
    address: string,
    tokenId: string,
    chain?: string,
    format?: string,
    offset?: number,
    limit?: number,
    order?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getTokenIdOwners(
      address,
      tokenId,
      chain,
      format,
      offset,
      limit,
      order,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Returns metadata (name, symbol, decimals, logo) for a given token contract address.
   * @summary Gets token metadata
   * @param {Array<string>} addresses The addresses to get metadata for
   * @param {ChainList} [chain] The chain to query
   * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
   * @param {string} [providerUrl] web3 provider url to user when using local dev chain
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getTokenMetadata(
    addresses: Array<string>,
    chain?: ChainList,
    subdomain?: string,
    providerUrl?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getTokenMetadata(
      addresses,
      chain,
      subdomain,
      providerUrl,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Returns metadata (name, symbol, decimals, logo) for a given token contract address.
   * @summary Gets token metadata
   * @param {Array<string>} symbols The symbols to get metadata for
   * @param {ChainList} [chain] The chain to query
   * @param {string} [subdomain] The subdomain of the moralis server to use (Only use when selecting local devchain as chain)
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getTokenMetadataBySymbol(
    symbols: Array<string>,
    chain?: ChainList,
    subdomain?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getTokenMetadataBySymbol(
      symbols,
      chain,
      subdomain,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Returns the price nominated in the native token and usd for a given token contract address.
   * @summary Gets token price
   * @param {string} address The address of the token contract
   * @param {ChainList} [chain] The chain to query
   * @param {string} [providerUrl] web3 provider url to user when using local dev chain
   * @param {string} [exchange] The factory name or address of the token exchange
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getTokenPrice(
    address: string,
    chain?: ChainList,
    providerUrl?: string,
    exchange?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getTokenPrice(
      address,
      chain,
      providerUrl,
      exchange,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Gets the transfers of the tokens matching the given parameters
   * @summary Gets NFT transfers of a given contract
   * @param {string} address Address of the contract
   * @param {string} tokenId The id of the token
   * @param {string} [chain] The chain to query
   * @param {string} [format] The format of the token id
   * @param {number} [offset] offset
   * @param {number} [limit] limit
   * @param {string} [order] The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: \&quot;block_number\&quot;, \&quot;block_number.ASC\&quot;, \&quot;block_number.DESC\&quot;, Example 2: \&quot;block_number and contract_type\&quot;, \&quot;block_number.ASC,contract_type.DESC\&quot;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof TokenApi
   */
  public getWalletTokenIdTransfers(
    address: string,
    tokenId: string,
    chain?: string,
    format?: string,
    offset?: number,
    limit?: number,
    order?: string,
    options?: any
  ) {
    return TokenApiFp(this.configuration).getWalletTokenIdTransfers(
      address,
      tokenId,
      chain,
      format,
      offset,
      limit,
      order,
      options
    )(this.fetch, this.basePath);
  }
}
