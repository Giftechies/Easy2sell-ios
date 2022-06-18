import * as actionTypes from "./actionTypes";

export const onLoadNotification = (params, callback = () => {}) => {
  return {
    type: actionTypes.FETCH_NOTIFICATION,
    params,
    callback,
  };
};
