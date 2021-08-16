import Web3 from "web3";
import { useMetaMask } from "metamask-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppBar, Button, Toolbar } from "@material-ui/core";

import { setUser } from "../../store/reducers/auth";
import { web3 } from "../../helper/web3";

export const Header = () => {
  const { connect, account } = useMetaMask();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(account);
    if (!account) {
      dispatch(
        setUser({
          address: null,
        })
      );
    } else {
      web3.eth.setProvider(Web3.givenProvider);
      dispatch(
        setUser({
          address: account,
        })
      );
    }
  }, [account, dispatch]);

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        {account && <Button>{account}</Button>}
        {!account && (
          <Button variant="outlined" onClick={connect}>
            Connect
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
