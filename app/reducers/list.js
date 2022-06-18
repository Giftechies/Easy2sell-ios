import * as actionTypes from "@actions/actionTypes";
const initialState = {
  data: null,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SAVE_LIST:
      return {
        ...state,
        data: action.list,
      };
    case actionTypes.ON_UPDATE_LIST:
      const exist = state.data.some((item) => item.id == action.item.id);
      if (exist) {
        return {
          ...state,
          data: state.data.map((item) => {
            if (item.id == action.item.id) {
              return action.item;
            }
            return item;
          }),
        };
      }

    default:
      return state;
  }
};
