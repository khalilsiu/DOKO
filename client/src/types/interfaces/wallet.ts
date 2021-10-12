import { WalletName } from '../enums';

export interface Wallet {
  name: WalletName;
  icon: string;
  label: string;
}
