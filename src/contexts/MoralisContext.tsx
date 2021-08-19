import { createContext, PropsWithChildren, ReactNode } from "react";
import { config } from "../config";
import { AccountApi } from "../libs/moralis-api.ts";

interface MoralisContextValue {
  moralisAccountApi: AccountApi;
}

const moralisAccountApi = new AccountApi({
  apiKey: config.moralisApiKey,
});

export const MoralisContext = createContext<MoralisContextValue>({
  moralisAccountApi,
});

export const MoralisContextProvider = ({
  children,
}: PropsWithChildren<ReactNode>) => {
  return (
    <MoralisContext.Provider value={{ moralisAccountApi }}>
      {children}
    </MoralisContext.Provider>
  );
};
