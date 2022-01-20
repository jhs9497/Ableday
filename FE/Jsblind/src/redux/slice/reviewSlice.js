import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  interesting: 0,
  accuracy: 0,
  like: 0,
  manners: 0,
};

export const reviewSlice = createSlice({
  name: 'review',

  initialState,

  reducers: {
    postReview: (state, action) => {
      console.log('review보내기');
    },
    postReivewAsync: (state, action) => {
      return {
        accuracy: action.payload.accuracy,
        interesting: action.payload.interesting,
        like: action.payload.like,
        manners: action.payload.manner,
      };
    },
  },
});

export const reviewActions = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;
