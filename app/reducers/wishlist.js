import * as actionTypes from "@actions/actionTypes";
const initialState = {
  list: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SAVE_WISHLIST:
      return {
        ...state,
        list: action.list,
      };
    // case actionTypes.DELETE_WISHLIST:
    //   if (action.params) {
    //     return {
    //       ...state,
    //       list: state.list.filter((item) => item.id != action.params.id),
    //     };
    //   } else {
    //     return {
    //       ...state,
    //       list: [],
    //     };
    //   }
    // case actionTypes.ON_UPDATE_WISHLIST:
    //   const exist = state.list.some((item) => item.id == action.item.id);
    //   if (exist) {
    //     return {
    //       ...state,
    //       list: state.list.filter((item) => {
    //         return item.id != action.item.id;
    //       }),
    //     };
    //   }
    //   return {
    //     ...state,
    //     list: state.list.concat(action.item),
    //   };
    default:
      return state;
  }
};
