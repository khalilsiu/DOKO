export interface ToolbarItemsProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  loading: boolean;
  address: string | null;
  login: () => void;
}
