import * as actionTypes from "./actionTypes";

export const onLoadMessenger = (params, callback = () => {}) => {
  return {
    type: actionTypes.FETCH_MESSAGE,
    params,
    callback,
  };
};
