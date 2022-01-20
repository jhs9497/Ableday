// import { BACKGROUND_CLOUDY } from "../type/bgCloudyType";
// import { CounterAction } from "../actions/bgCloudyAction";

import { BACKGROUND_CLOUDY } from 'redux/type/bgCloudyType';

const initialState = false;

const BgCloudyReducer = (state = initialState, action) => {
  switch (action.type) {
    case BACKGROUND_CLOUDY: {
      return !state;
    }
    default:
      return state;
  }
};

export default BgCloudyReducer;
