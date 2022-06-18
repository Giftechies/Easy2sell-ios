import * as actionTypes from "@actions/actionTypes";
import { BaseSetting } from "@config";

const initialState = {
  setting: null,
  design: BaseSetting.defaultDesign,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SAVE_SETTING:
      return {
        ...state,
        setting: action.setting,
      };
    case actionTypes.SAVE_DESIGN:
      return {
        ...state,
        design: action.design,
      };
    default:
      return state;
  }
};
