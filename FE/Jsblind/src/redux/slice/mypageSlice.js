import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  isLoading: true,
  isSuccess: false,
  error: null,
};

export const myPageSlice = createSlice({
  name: "mypage",
  initialState,
  reducers: {
    getMyPage: (state, action) => {},
    getMypageAsync: (state, { payload: data }) => {
      return {
        ...state,
        data: data,
        isLoading: false,
        isSuccess: true,
        error: null,
      };
    },
    getFrList: (state, action) => {},
    getFrListAsync: (state, { payload: data }) => {
      return {
        data: data,
        isLoading: false,
        isSuccess: true,
        error: null,
      };
    },
    getError: (state, action) => {
      return {
        error: true,
      };
    },
  },
});

export const myPageActions = myPageSlice.actions;

export const myPageReducer = myPageSlice.reducer;
