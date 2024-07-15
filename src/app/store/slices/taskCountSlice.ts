import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TaskCountState {
  count: number;
}

const initialState: TaskCountState = {
  count: 0,
};

const taskCountSlice = createSlice({
  name: 'taskCount',
  initialState,
  reducers: {
    setTaskCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
  },
});

export const { setTaskCount } = taskCountSlice.actions;
export default taskCountSlice.reducer;
