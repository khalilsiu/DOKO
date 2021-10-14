import { Dispatch, SetStateAction } from 'react';

export interface ToolbarItemsProps {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  loading: boolean;
  address: string | null;
  connect: () => void;
}
