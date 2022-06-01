import { configureStore } from '@reduxjs/toolkit';
import { asset } from './asset/assetSlice';
import { listings } from './assets/listingsSlice';
import { dclStats } from './stats/dclStatsSlice';

import { parcelTransactionHistory } from './asset/parcelTransactionHistorySlice';
import { appState } from './app/appStateSlice';
import { metaverseSummary } from './summary/metaverseSummary';
import { profileOwnership } from './profile/profileOwnershipSlice';
import { addressOwnership } from './address/addressOwnershipSlice';
import { leases } from './lease/leasesSlice';

const store = configureStore({
  reducer: {
    asset,
    appState,
    addressOwnership,
    profileOwnership,
    metaverseSummary,
    leases,
    listings,
    dclStats,
    parcelTransactionHistory,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
