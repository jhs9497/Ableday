import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nickname: '',
  introduction_keyword1: '',
  introduction_keyword2: '',
  introduction_keyword3: '',
  introduction_keyword4: '',
  introduction_keyword5: '',
};
export const updateSlice = createSlice({
  name: 'update',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      console.log('업데이트 완료');
    },
  },
});

export const updateReducers = updateSlice.reducer;
export const updateActions = updateSlice.actions;
