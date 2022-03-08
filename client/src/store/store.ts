import { configureStore } from '@reduxjs/toolkit';
import { appState } from './app';
import { asset } from './asset/assetSlice';
import { metaverseAssets } from './asset/metaverseAssetsFromServerSlice';
import { dclStats } from './stats/dclStatsSlice';
import { metaverseLeases } from './lease/metaverseLeasesSlice';
import { addressOwnership, collectionSummary, profileOwnership } from './summary';

const store = configureStore({
  reducer: {
    addressOwnership,
    profileOwnership,
    collectionSummary,
    appState,
    metaverseLeases,
    asset,
    metaverseAssets,
    dclStats,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
