import * as actionTypes from "@actions/actionTypes";
const initialState = {
  countrys: [],
  sliders: [],
  categories: [],
  locations: [],
  recents: [],
  populars: [],
  recommends: [],
  features: [],
  news: [],
  banner: null,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SAVE_HOME_DATA:
      return {
        ...state,
        countrys: action.countrys ?? [],
        sliders: action.sliders ?? [],
        categories: action.categories ?? [],
        locations: action.locations ?? [],
        recents: action.recents ?? [],
        populars: action.populars ?? [],
        recommends: action.recommends ?? [],
        features: action.features ?? [],
        news: action.news ?? [],
        items: action.items ?? [],
        banner: action.banner,
      };
    default:
      return state;
  }
};
