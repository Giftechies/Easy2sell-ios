import * as actionTypes from "@actions/actionTypes";
const initialState = {
  list: null,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SAVE_NOTIFICATION:
      return {
        ...state,
        list: action.list ?? [],
      };
    default:
      return state;
  }
};
