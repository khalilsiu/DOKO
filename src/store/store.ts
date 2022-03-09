import { configureStore } from '@reduxjs/toolkit';
import { asset } from './asset/assetSlice';
import { metaverseAssets } from './asset/metaverseAssetsFromServerSlice';
import { metaverseLeases } from './lease/metaverseLeasesSlice';
import { parcelTransactionHistory } from './asset/parcelTransactionHistorySlice';
import { appState } from './app/appStateSlice';
import { addressOwnership } from './summary/addressOwnershipSlice';
import { metaverseSummary } from './summary/metaverseSummary';
import { profileOwnership } from './summary/profileOwnershipSlice';

const store = configureStore({
  reducer: {
    asset,
    appState,
    addressOwnership,
    profileOwnership,
    metaverseSummary,
    metaverseLeases,
    metaverseAssets,
    parcelTransactionHistory,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
