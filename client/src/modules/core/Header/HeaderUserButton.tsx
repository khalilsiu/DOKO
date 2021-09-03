import { Button, MenuItem, MenuList, Paper } from '@material-ui/core';
import Popover from '../../../components/Popover';
import { minimizeAddress } from '../../../libs/utils';

interface Props {
  onLogin: () => void;
  onLogout: () => void;
  address: string | null;
  loading: boolean;
}

export const HeaderUserButton = ({
  onLogin = () => null,
  address,
  onLogout = () => null,
  loading
}: Props) => {
  return address ? (
    <Popover
      reference={
        <Button className="gradient-button" variant="outlined" disabled={loading}>
          {minimizeAddress(address)}
        </Button>
      }
    >
      <Paper>
        <MenuList color="primary">
          <MenuItem>
            <a
              style={{ textDecoration: 'none', color: 'black' }}
              href="https://app.gitbook.com/@doko-nft/s/doko/"
              target="_blank"
              rel="noreferrer"
            >
              About DOKO
            </a>
          </MenuItem>
        </MenuList>
      </Paper>
    </Popover>
  ) : (
    <Button
      style={{ marginLeft: 24, width: 240 }}
      className="gradient-button"
      disabled={loading}
      variant="outlined"
      onClick={() => onLogin()}
    >
      Connect Metamask
    </Button>
  );
};
