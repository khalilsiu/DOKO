import { Button, MenuItem, MenuList, Paper } from "@material-ui/core";
import { useState } from "react";
import { ArrowContainer, Popover } from "react-tiny-popover";

interface Props {
  onLogin: () => void;
  onLogout: () => void;
  address: string | null;
  loading: boolean;
}

let popoverTimeout: any = null;

export const HeaderUserButton = ({
  onLogin = () => null,
  address,
  onLogout = () => null,
  loading,
}: Props) => {
  const [open, setOpen] = useState(false);

  const hidePopover = (time = 0) => {
    popoverTimeout = setTimeout(() => {
      setOpen(false);
    }, time);
  };

  const showPopover = () => {
    clearTimeout(popoverTimeout);
    setOpen(true);
  };

  return address ? (
    <Popover
      isOpen={open}
      positions={["bottom"]}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowSize={8}
          arrowColor={"white"}
        >
          <Paper>
            <MenuList
              color="primary"
              onMouseEnter={() => showPopover()}
              onMouseLeave={() => hidePopover(100)}
            >
              <MenuItem onClick={() => onLogout()}>Sign Out</MenuItem>
            </MenuList>
          </Paper>
        </ArrowContainer>
      )}
    >
      <Button
        color="default"
        variant="outlined"
        disabled={loading}
        onMouseEnter={() => showPopover()}
        onMouseLeave={() => hidePopover(100)}
      >
        {address.substring(0, 6) + "..." + address.substr(-4)}
      </Button>
    </Popover>
  ) : (
    <Button
      disabled={loading}
      color="default"
      variant="outlined"
      onClick={() => onLogin()}
    >
      Connect
    </Button>
  );
};
