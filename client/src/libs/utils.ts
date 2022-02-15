import moment from 'moment';
import { web3 } from './web3';
import { parseEthPrice } from '../store/meta-nft-collections';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('./abis/erc721.json');

export const minimizeAddress = (address: string) =>
  address ? `${address.substr(0, 6)}...${address.substr(-4)}` : '';

export const normalizeImageURL = (nft: any) => {
  if (nft.metadata && !nft.metadata.image && nft.metadata.image_data) {
    nft.metadata.image = nft.metadata.image_data;
  }
  if (nft.metadata?.image?.indexOf('ipfs') === 0) {
    nft.metadata.image = `https://ipfs.io/${nft.metadata.image
      .replace('ipfs/', '')
      .replace('ipfs://', 'ipfs/')}`;
  }
  return nft;
};

export const zeroAddress = '0x0000000000000000000000000000000000000000';

export const humanizeDate = (date: string) => {
  const _date = new Date(date);
  const year = _date.getFullYear();
  const day = _date.getDate();
  const month = _date.getMonth() + 1;
  return `${year}/${month}/${day}`;
};

export const chainMapping = (chain: string) => {
  interface Map {
    [key: string]: string;
  }
  const ChainMap: Map = {
    eth: 'Ethereum',
    bsc: 'BSC',
    polygon: 'Polygon',
    solana: 'Solana',
  };

  return ChainMap[chain];
};

export const getTotalSupply = async (address: string) => {
  const contract = new web3.eth.Contract(abi, address);
  try {
    return await contract.methods.totalSupply().call();
  } catch (e) {
    return 0;
  }
};

export const sortTxsByDates = (txs: any[]) => {
  const _txs = txs.map((tx) => {
    tx.date = moment(tx.date, 'YYYY/MM/DD').unix();
    return tx;
  });
  const sorted = _txs.sort((tx1: any, tx2: any) => tx2.date - tx1.date);
  // convert back to string
  const result = sorted.map((tx: any) => {
    tx.date = moment(tx.date * 1000).format('YYYY/MM/DD');
    return tx;
  });
  return result;
};

export const formatTx = (tx: any, chain: string) => {
  const formatted: any = {};
  if (chain === 'eth') {
    formatted.date = humanizeDate(tx.created_date);
    switch (tx.event_type) {
      case 'transfer':
        if (tx.from_account.address === zeroAddress) {
          formatted.event = 'Mint';
        } else {
          formatted.event = 'Transfer';
        }
        formatted.from = minimizeAddress(tx.from_account.address);
        formatted.to = minimizeAddress(tx.to_account.address);
        formatted.price = '';
        break;
      case 'successful':
        formatted.event = 'Sale';
        formatted.from = minimizeAddress(tx.seller.address);
        formatted.to = minimizeAddress(tx.winner_account.address);
        formatted.price = tx.total_price
          ? parseEthPrice(tx.total_price, tx.payment_token).toFixed(2)
          : '0';
        break;
      case 'bid_entered':
        formatted.from = tx.from_account.address;
        formatted.event = 'Bid';
        formatted.price = tx.bid_amount
          ? parseEthPrice(tx.bid_amount, tx.payment_token).toFixed(2)
          : '0';
        formatted.payment_token = tx.payment_token.symbol;
        break;
      case 'bid_withdrawn':
        formatted.from = tx.from_account.address;
        formatted.event = 'Bid withdrawn';
        formatted.price = '0';
        formatted.payment_token = tx.payment_token.symbol;
        break;
      case 'offer_withdrawn':
        formatted.from = tx.from_account.address;
        formatted.event = 'Offer withdrawn';
        formatted.price = '0';
        formatted.payment_token = tx.payment_token.symbol;
        break;
      case 'offer_entered':
        formatted.from = tx.from_account.address;
        formatted.event = 'Offer Entered';
        formatted.price = tx.bid_amount
          ? parseEthPrice(tx.bid_amount, tx.payment_token).toFixed(2)
          : '0';
        formatted.payment_token = tx.payment_token.symbol;
        break;
      case 'created':
        formatted.event = 'Listing';
        formatted.price = tx.ending_price
          ? parseEthPrice(tx.ending_price, tx.payment_token).toFixed(2)
          : '0';
        break;
      default:
        break;
    }
  } else if (chain === 'polygon' || chain === 'bsc') {
    formatted.price = tx.value
      ? Number.parseFloat(web3.utils.fromWei(tx.value, 'ether')).toFixed(2)
      : 0;
    formatted.date = humanizeDate(tx.block_timestamp);
    formatted.event = tx.from_address === zeroAddress ? 'Mint' : 'Transfer';
    formatted.from = minimizeAddress(tx.from_address);
    formatted.to = minimizeAddress(tx.to_address);
  }

  return formatted;
};

export const shortenAddress = (address: string) =>
  `${address.slice(0, 2)}...${address.slice(address.length - 4)}`;

export function isValidHttpUrl(str: string) {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function isSolAddress(address: string) {
  return !address.startsWith('0x') && address.length >= 32 && address.length <= 44;
}

export function formatPrice(label: number, decimals = 1) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((i) => label >= i.value);
  return item ? (label / item.value).toFixed(decimals).replace(rx, '$1') + item.symbol : '0';
}
