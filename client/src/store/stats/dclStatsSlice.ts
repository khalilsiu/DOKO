import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../libs/api';

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
  const response = await api.get('/stats/dcl');
  return response.data;
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
