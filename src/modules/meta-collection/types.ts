export interface ICollection {
  _id: string;
  token_address: string;
  abi?: any;
  address: string;
  chain: string;
  contract_type: string;
  discord_link: string;
  name: string;
  priority: number;
  start_ts: string;
  supports_token_uri: string;
  symbol: string;
  synced_at: string;
  twitter_link: string;
  website_link: string;
  total_volume: number;
  owners: number;
  items: number;
  [key: string]: any;
}
