import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Placeholder slice — extend or add slices (e.g. `userSlice`) as needed. */
interface AppState {
  ready: boolean;
}

const initialState: AppState = {
  ready: true,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setReady: (state, action: PayloadAction<boolean>) => {
      state.ready = action.payload;
    },
  },
});

export const { setReady } = appSlice.actions;
