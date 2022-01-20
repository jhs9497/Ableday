import { takeEvery, takeLatest, call, take } from "@redux-saga/core/effects";
import { deleteFR, getFrListAsync, getPageAsync } from "redux/saga/myPageSaga";
import { postReviewAsync } from "redux/saga/reviewSaga";
import { updateAsync } from "redux/saga/updateSaga";
import { frListActions } from "redux/slice/frListSlice";
import { myPageActions } from "redux/slice/mypageSlice";
import { reviewActions } from "redux/slice/reviewSlice";
import { updateActions } from "redux/slice/updateSlice";

const { getMyPage } = myPageActions;
const { postReview } = reviewActions;
const { updateProfile } = updateActions;
export default function* rootWatcher() {
  yield takeLatest(getMyPage.type, getPageAsync);
  yield takeLatest(postReview.type, postReviewAsync);
  yield takeLatest(updateProfile.type, updateAsync);
  yield takeEvery(frListActions.getFrList, getFrListAsync);
  yield takeLatest(frListActions.deleteFr, deleteFR);
}
