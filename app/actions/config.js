import * as actionTypes from "./actionTypes";

export const onSetup = (design, user, callback) => {
  return {
    type: actionTypes.SETUP_CONFIG,
    callback,
    user,
    design: design,
  };
};
