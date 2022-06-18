import { all, put, takeEvery } from "redux-saga/effects";
import * as actionTypes from "@actions/actionTypes";
import * as api from "@api";
import { ProductModel } from "@models";

function* loadList(action) {
  try {
    const params = {};
    let response;
    switch (action.design) {
      case "real_estate":
        response = yield api.getListProductRealEstate(params);
        break;

      case "event":
        response = yield api.getListProductEvent(params);
        break;

      case "food":
        response = yield api.getListProductFood(params);
        break;

      default:
        response = yield api.getListProduct(params);
        response.data = response.data.map?.((item) => {
          return new ProductModel(item);
        });
        break;
    }

    yield put({
      type: actionTypes.SAVE_LIST,
      list: response.data,
    });
    action.callback?.(response);
  } catch (error) {
    console.log("loadList", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* watchLoadList() {
  yield takeEvery(actionTypes.LOAD_LIST, loadList);
}

export default function* authSagas() {
  yield all([watchLoadList()]);
}
