/* eslint-disable no-param-reassign */
/* eslint-disable implicit-arrow-linebreak */
import { web3 } from './web3';

export const minimizeAddress = (address: string) =>
  `${address.substr(0, 6)}...${address.substr(-4)}`;

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
  return `${day}/${month}/${year}`;
};

export const chainMapping = (chain: string) => {
  interface Map {
    [key: string]: string;
  }
  const ChainMap: Map = {
    eth: 'Ethereum',
    bsc: 'BSC',
    matic: 'Matic',
    sol: 'Solana',
  };

  return ChainMap[chain];
};

export const formatTx = (tx: any) => {
  const formatted: any = {};
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
        ? Number.parseFloat(web3.utils.fromWei(tx.total_price, 'ether')).toFixed(2)
        : '0';
      break;
    case 'bid_entered':
      formatted.from = tx.from_account.address;
      formatted.event = 'Bid';
      formatted.price = tx.bid_amount
        ? Number.parseFloat(web3.utils.fromWei(tx.bid_amount, 'ether')).toFixed(2)
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
        ? Number.parseFloat(web3.utils.fromWei(tx.bid_amount, 'ether')).toFixed(2)
        : '0';
      formatted.payment_token = tx.payment_token.symbol;
      break;
    case 'created':
      formatted.event = 'Listing';
      formatted.price = tx.ending_price
        ? Number.parseFloat(web3.utils.fromWei(tx.ending_price, 'ether')).toFixed(2)
        : '0';
      formatted.payment_token = tx.payment_token.symbol;
      break;
    default:
      break;
  }
  return formatted;
};
