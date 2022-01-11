import { configureStore } from '@reduxjs/toolkit';
import { appState } from './app';
import { addressOwnership, collectionSummary, profileOwnership } from './meta-nft-collections';

const store = configureStore({
  reducer: {
    addressOwnership,
    profileOwnership,
    collectionSummary,
    appState,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
