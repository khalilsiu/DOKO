import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from '../../constants/metaverses';
import ContractServiceAPI from '../../libs/contract-service-api';

export interface MetaverseSummary {
  traits: number[];
}

const initialState: MetaverseSummary[] = metaverses.map((metaverse) => ({
  traits: metaverse.traits.map(() => 0),
}));

export const parsePriceETH = (price: string, payment_token: any): number => {
  const priceInToken = parseFloat(price);
  const ethPrice = parseFloat(payment_token.eth_price);
  return Number(parseFloat(`${(priceInToken * ethPrice) / 10 ** payment_token.decimals}`).toFixed(3));
};

export const parsePriceUSD = (price: string, payment_token: any): number => {
  return Number(parseFloat(`${(payment_token?.usd_price ?? 0) * parsePriceETH(price, payment_token)}`).toFixed(3));
};

export const fetchMetaverseSummary = createAsyncThunk('MetaverseSummary/fetchMetaverseSummary', async () => {
  const metaverseFloorPrices: number[][] = [];
  for (const metaverse of metaverses) {
    const traitFloorPrices: number[] = [];
    for (const trait of metaverse.traits) {
      const response = await ContractServiceAPI.getAssetFloorPrice(metaverse.primaryAddress, trait);
      const { price, payment_token } = response;
      traitFloorPrices.push(parsePriceETH(price, payment_token));
    }
    metaverseFloorPrices.push(traitFloorPrices);
  }
  return metaverseFloorPrices;
});

const metaverseSummarySlice = createSlice({
  name: 'MetaverseSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMetaverseSummary.fulfilled, (state, action) =>
      state.map((metaversesummary, index) => ({
        ...metaversesummary,
        // fetchMetaverseSummary takes care of all metaversesummary related calls
        // to be extended
        traits: action.payload[index],
      })),
    );
  },
});

// export const { } = metaverseSummarySlice.actions;

export const metaverseSummary = metaverseSummarySlice.reducer;
