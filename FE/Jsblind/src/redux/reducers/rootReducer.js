import { combineReducers } from "redux";
// import BgCloudyReducer from "./bgCloudyReducer";
// import { loginReducer } from "src/common/redux/slice/loginSlice";
// import { myPageReducer } from "src/common/redux/slice/mypageSlice";
// import { reviewReducer } from "src/common/redux/slice/reviewSlice";
// import { updateReducers } from "src/common/redux/slice/updateSlice";
import { updateReducers } from "redux/slice/updateSlice";
import { reviewReducer } from "redux/slice/reviewSlice";
import { myPageReducer } from "redux/slice/mypageSlice";
import BgCloudyReducer from "redux/reducers/bgCloudyReducer";
import { frListReducers } from "redux/slice/frListSlice";

export const rootReducer = combineReducers({
  BgCloudyReducer,
  myPageReducer,
  reviewReducer,
  updateReducers,
  frListReducers,
});
