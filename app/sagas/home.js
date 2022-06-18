import { all, put, takeEvery } from "redux-saga/effects";
import * as actionTypes from "@actions/actionTypes";
import * as api from "@api";
import { ProductModel, CategoryModel, CategoryNewModel } from "@models";

function* fetchHome(action) {
  try {
    action.params=action?.location;
    let response;
    switch (action.design) {
      case "real_estate":
        response = yield api.getHomeRealEstate(action.params);
        if (response.success) {
          yield put({
            type: actionTypes.SAVE_HOME_DATA,
            countrys: response.data?.countrys,
            locations: response.data?.locations,
            populars: response.data?.populars,
            recommends: response.data?.recommends,
          });
        }
        break;

      case "event":
        response = yield api.getHomeEvent(action.params);
        if (response.success) {
          yield put({
            type: actionTypes.SAVE_HOME_DATA,
            categories: response.data?.categories,
            features: response.data?.features,
            news: response.data?.news,
          });
        }
        break;

      case "food":
        response = yield api.getHomeFood(action.params);
        if (response.success) {
          yield put({
            type: actionTypes.SAVE_HOME_DATA,
            countrys: response.data?.countrys,
            sliders: response.data?.sliders,
            categories:response.data?.categories?.map?.((item) => {
              return new CategoryNewModel(item);
            }),
            recommends: response.data?.recommends,
            banner: response.data?.banner,
            locations: response.data?.locations,
          });
        }
        break;

      default:
        response = yield api.getHome(action.params);
        if (response.success) {
          yield put({
            type: actionTypes.SAVE_HOME_DATA,
            sliders: response.data?.sliders,
            categories: response.data?.categories?.map?.((item) => {
              return new CategoryNewModel(item);
            }),
            countries:[],
            recommends: response.data?.recommends,
            items: response.data?.items,
            // locations: response.data?.locations?.map?.((item) => {
            //   return new CategoryModel(item);
            // }),
            // recents: response.data?.recent_posts?.map?.((item) => {
            //   return new ProductModel(item);
            // }),
          });
        }
        console.log("fetchHome", response);
        break;
    }
    action.callback?.(response);
  } catch (error) {
    console.log("fetchHome", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* watchLoadHome() {
  yield takeEvery(actionTypes.FETCH_HOME, fetchHome);
}

export default function* authSagas() {
  yield all([watchLoadHome()]);
}
