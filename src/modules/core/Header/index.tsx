import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";

import { setUser } from "../../../store/reducers/auth";
import Moralis, {
  moralisAuthenticate,
  moralisCurrentUser,
  moralisLogout,
} from "../../../libs/moralis";
import { State } from "../../../store";
import { User } from "../../../interfaces";
import { HeaderUserButton } from "./HeaderUserButton";
import Logo from "./DOKO_LOGO_COLOUR.png";

export const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector<State, User>((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const styles = useStyles();

  const logout = useCallback(() => {
    setLoading(true);
    moralisLogout()
      .then(() => {
        dispatch(setUser({ address: null }));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    const currentUser = moralisCurrentUser();

    if (currentUser) {
      dispatch(
        setUser({
          address: currentUser.attributes.ethAddress,
        })
      );
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    Moralis.Web3.onAccountsChanged((accounts) => {
      if (!accounts.length) {
        logout();
      }
    });
  }, [logout]);

  const userLogin = () => {
    setLoading(true);
    moralisAuthenticate().then(
      (user) => {
        setLoading(false);
        dispatch(
          setUser({
            address: user.attributes.ethAddress,
          })
        );
      },
      () => setLoading(false)
    );
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      className={styles.headerContainer}
    >
      <Toolbar style={{ paddingTop: 8, paddingBottom: 8 }}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item style={{ marginTop: 4 }}>
            <img src={Logo} width={48} alt="" />
          </Grid>
          <Grid item>
            <Typography variant="h3" style={{ fontWeight: 800 }}>
              DOKO
            </Typography>
          </Grid>
        </Grid>
        <HeaderUserButton
          loading={loading}
          address={user.address}
          onLogin={userLogin}
          onLogout={logout}
        />
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles(() => ({
  headerContainer: {
    boxShadow: "none",
  },
}));
