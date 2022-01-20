// import { update } from "src/common/redux/api";
import { put, delay } from "redux-saga/effects";
import axios from "axios";
import { update } from "redux/api";
import history from "utils/history";

export function* updateAsync(action) {
  const token = localStorage.getItem("token");
  const data = action.payload;
  console.log(data);
  const response = yield axios({
    method: "PUT",
    baseURL: update,
    data: data,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  yield localStorage.removeItem("nickname");
  yield localStorage.setItem("nickname", data.nickname);
  yield delay(100);
  history.go(0);
}
