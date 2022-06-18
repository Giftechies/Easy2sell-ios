import * as actionTypes from "./actionTypes";

export const onLoad = (params, callback = () => {}) => {
  return {
    type: actionTypes.GET_WISHLIST,
    params,
    callback,
  };
};

export const onDelete = (params) => {
  return {
    type: actionTypes.DELETE_WISHLIST,
    params,
  };
};

export const onUpdate = (item) => {
  return {
    type: actionTypes.ON_UPDATE_WISHLIST,
    item,
  };
};
