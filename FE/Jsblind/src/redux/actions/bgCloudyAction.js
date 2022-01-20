import { BACKGROUND_CLOUDY } from 'redux/type/bgCloudyType';

export const BgCloudy = (state) => {
  return {
    type: BACKGROUND_CLOUDY,
    payload: state,
  };
};
