import { all, put, takeEvery, delay } from "redux-saga/effects";
import * as actionTypes from "@actions/actionTypes";
import * as api from "@api";
import { ProductModel, PaginationModel } from "@models";

function* loadWishList(action) {
  try {
    let response;
    response = yield api.getWishListRealEstate(action.params);
    if (response.success) {
      const list = response.data;
      yield put({
        type: actionTypes.SAVE_WISHLIST,
        list,
      });
    }
    // switch (action.design) {
    //   case "real_estate":
    //     response = yield api.getWishListRealEstate(action.params);
    //     if (response.success) {
    //       const list = response.data;
    //       yield put({
    //         type: actionTypes.SAVE_WISHLIST,
    //         list,
    //       });
    //     }
    //     break;

    //   case "event":
    //     response = yield api.getWishListEvent(action.params);
    //     if (response.success) {
    //       const list = response.data;
    //       yield put({
    //         type: actionTypes.SAVE_WISHLIST,
    //         list,
    //       });
    //     }
    //     break;

    //   case "food":
    //     response = yield api.getWishListFood(action.params);
    //     if (response.success) {
    //       const list = response.data;
    //       yield put({
    //         type: actionTypes.SAVE_WISHLIST,
    //         list,
    //       });
    //     }
    //     break;

    //   default:
    //     response = yield api.getWishList(action.params);
    //     if (response.success) {
    //       const list = response.data.map?.((item) => {
    //         return new ProductModel(item);
    //       });
    //       yield put({
    //         type: actionTypes.SAVE_WISHLIST,
    //         list,
    //       });
    //     }
    //     break;
    // }
    action.callback?.(response);
  } catch (error) {
    console.log("loadWishList", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* watchLoad() {
  yield takeEvery(actionTypes.GET_WISHLIST, loadWishList);
}

export default function* authSagas() {
  yield all([watchLoad()]);
}
