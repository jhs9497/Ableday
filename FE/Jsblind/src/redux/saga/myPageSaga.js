import { put, delay } from "redux-saga/effects";
import axios from "axios";
import { myPageActions } from "redux/slice/mypageSlice";
import { myPageApi, frlist, frdelete } from "redux/api";
import { frListActions } from "redux/slice/frListSlice";
import history from "utils/history";
import Swal from "sweetalert2";
import lion from "redux/saga/lion.png";
export function* getPageAsync(action) {
  const token = action.payload;
  try {
    const data = yield axios({
      method: "GET",
      baseURL: myPageApi,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(myPageActions.getMypageAsync(data.data));
  } catch (e) {
    yield put(myPageActions.getError(e));
    yield alert("error 발생");
  }
}

export function* getFrListAsync(action) {
  const token = action.payload;

  const data = yield axios.get(frlist, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  yield put(frListActions.getFrListAsync(data));
}

export function* deleteFR(action) {
  const user = action.payload;

  Swal.fire({
    text: "삭제하시겠습니까?",
    imageUrl: lion,
    showCancelButton: true,
    imageHeight: 200,
    imageWidth: 200,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "네!!",
    cancelButtonText: "취소!!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(frlist, {
        data: {
          userId: user.name,
        },
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      history.go(0);
    }
  });
}
