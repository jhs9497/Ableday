import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  isLoading: true,
  isSuccess: false,
  error: null,
};

export const frListSlice = createSlice({
  name: "frList",
  initialState,
  reducers: {
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
    deleteFr: (state, action) => {
      console.log("deleteFR");
    },
  },
});

export const frListActions = frListSlice.actions;

export const frListReducers = frListSlice.reducer;
