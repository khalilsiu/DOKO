import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ContractServiceAPI from 'libs/contract-service-api';

export interface DclStats {
  id: number;
  coordinates: string;
  ytdUsers: number;
  ytdSessions: number;
  ytdMedianSessionTime: number;
  ytdMaxConcurrentUsers: number;
  weeklyUsers: number;
  weeklySessions: number;
  weeklyMedianSessionTime: number;
  weeklyMaxConcurrentUsers: number;
  monthlyUsers: number;
  monthlySessions: number;
  monthlyMedianSessionTime: number;
  monthlyMaxConcurrentUsers: number;
}

const initialState: DclStats[] = [];

export const getDclStats = createAsyncThunk('DclStats/getDclStats', async () => {
  return await ContractServiceAPI.getDclStats();
});

const dclStatsSlice = createSlice({
  name: 'DclStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDclStats.fulfilled, (_state, action) => action.payload);
  },
});

export const dclStats = dclStatsSlice.reducer;
