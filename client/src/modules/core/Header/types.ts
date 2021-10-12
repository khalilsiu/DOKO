import { Dispatch, SetStateAction } from 'react';
import { WalletName } from '../../../types';

export interface ToolbarItemsProps {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  loading: boolean;
  address: string | null;
  // eslint-disable-next-line no-unused-vars
  login: (wallet: WalletName) => void;
}
