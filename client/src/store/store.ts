import { configureStore } from '@reduxjs/toolkit';
import { userOwnership, collectionSummary } from './meta-nft-collections';

const store = configureStore({
  reducer: {
    userOwnership,
    collectionSummary,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
