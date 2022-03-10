import { WalletName } from './enums';

export interface User {
  address: string | null;
}

export interface Wallet {
  name: WalletName;
  icon: string;
  label: string;
}

export type Pair<T, K> = [T, K];

export interface ThunkError {
  error: string;
}
