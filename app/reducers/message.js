import * as actionTypes from "@actions/actionTypes";
const initialState = {
  message: null,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SAVE_MESSAGE:
      return {
        ...state,
        message: action.message ?? [],
      };
    default:
      return state;
  }
};
