import * as actionTypes from "./actionTypes";

export const onLoad = (design, callback,location=null) => {
  return {
    type: actionTypes.FETCH_HOME,
    callback,
    design,
    location
  };
};
