import Moralis from "moralis";
import { config } from "../config";

Moralis.initialize(config.moralisApplicationId);
Moralis.serverURL = config.moralisServerUrl;

export const moralisAuthenticate = () => Moralis.Web3.authenticate();
export const moralisLogout = () => Moralis.User.logOut();
export const moralisCurrentUser = () => Moralis.User.current();
// Moralis.User.

export default Moralis;
