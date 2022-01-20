import { put } from 'redux-saga/effects';
import axios from 'axios';
import { reviewActions } from 'redux/slice/reviewSlice';
// import { reviewActions } from "src/common/redux/slice/reviewSlice";

export function* postReviewAsync(action) {
  // 이 안에선 동기적으로 처리함 async awiat 자동 세팅
  const data = action.payload;
  // put === dispatch
  yield put(reviewActions.postReivewAsync(data));
  // yield put(reviewActions.postReviewAsync(response.data));
}
