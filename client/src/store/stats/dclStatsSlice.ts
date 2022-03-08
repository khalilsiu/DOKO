import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DclAPI from '../../libs/dcl-api';

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
  const response = await DclAPI.get('/scenes/scene-stats.json');
  return Object.keys(response.data).reduce((previous, key) => {
    const landData = response.data[key];
    const current = {
      id: previous.length + 1,
      coordinates: key,
      ytdUsers: Number(landData['yesterday']['users']),
      ytdSessions: Number(landData['yesterday']['sessions']),
      ytdMedianSessionTime: Number(landData['yesterday']['median_session_time']),
      ytdMaxConcurrentUsers: Number(landData['yesterday']['max_concurrent_users']),
      weeklyUsers: Number(landData['last_7d']['users']),
      weeklySessions: Number(landData['last_7d']['sessions']),
      weeklyMedianSessionTime: Number(landData['last_7d']['median_session_time']),
      weeklyMaxConcurrentUsers: Number(landData['last_7d']['max_concurrent_users']),
      monthlyUsers: Number(landData['last_30d']['users']),
      monthlySessions: Number(landData['last_30d']['sessions']),
      monthlyMedianSessionTime: Number(landData['last_30d']['median_session_time']),
      monthlyMaxConcurrentUsers: Number(landData['last_30d']['max_concurrent_users']),
    };
    previous.push(current);
    return previous;
  }, [] as DclStats[]);
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
