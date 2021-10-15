import { configureStore } from '@reduxjs/toolkit';
import auth, { AuthState } from './reducers/auth';

export interface State {
  auth: AuthState;
}

export const store = configureStore<State>({
  reducer: {
    auth,
  },
});
