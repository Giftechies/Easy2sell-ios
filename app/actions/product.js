import * as actionTypes from "./actionTypes";

export const onLoadProduct = (id, design, datatype, callback = () => {}) => {
  return {
    type: actionTypes.FETCH_PRODUCT_DETAIL,
    id,
    datatype,
    design,
    callback,
  };
};

export const onLoadReview = (params, callback = () => {}) => {
  return {
    type: actionTypes.GET_COMMENT,
    params,
    callback,
  };
};

export const onFeekBack = (params, callback = () => {}) => {
  return {
    type: actionTypes.SAVE_COMMENT,
    params,
    callback,
  };
};

export const onFetchCategory = (params, callback = () => {}) => {
  return {
    type: actionTypes.GET_CATEGORY,
    params,
    callback,
  };
};
