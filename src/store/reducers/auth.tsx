import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { User } from "../../interfaces";

export interface AuthState {
  user: User;
}

const initialState: AuthState = {
  user: {
    address: null,
  },
};

export const authSlice = createSlice<
  AuthState,
  SliceCaseReducers<AuthState>,
  string
>({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
