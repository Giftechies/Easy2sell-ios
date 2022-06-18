import * as actionTypes from "./actionTypes";

export const onLoadList = (filter, design, callback = () => {}) => {
  return {
    type: actionTypes.LOAD_LIST,
    filter,
    design,
    callback,
  };
};

export const onUpdate = (item) => {
  return {
    type: actionTypes.ON_UPDATE_LIST,
    item,
  };
};
