import { all, takeEvery } from "redux-saga/effects";
import * as actionTypes from "@actions/actionTypes";
import * as api from "@api";
import {
  ProductModel,
  CommentModel,
  RatingModel,
  CategoryNewModel,
} from "@models";

function* fetchProduct(action) {
  try {
    let response;
    switch (action.design) {
      case "real_estate":
        response = yield api.getProductDetailRealEstate({ id: action.id, type: action.datatype });
        if (response.success) {
          const product = response.data;
          action.callback?.(product);
        }
        break;

      case "event":
        response = yield api.getProductDetailEvent({ id: action.id, type: action.datatype });
        if (response.success) {
          const product = response.data;
          action.callback?.(product);
        }
        break;

      case "food":
        response = yield api.getProductDetailFood({ id: action.id, type: action.datatype });
        if (response.success) {
          const product = response.data;
          action.callback?.(product);
        }
        break;

      default:
        response = yield api.getProductDetail({ id: action.id, type: action.datatype });
        if (response.success) {
          const product = new ProductModel(response.data);
          action.callback?.(product);
        }
        break;
    }
  } catch (error) {
    console.log("fetchProduct", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* loadReview(action) {
  try {
    const response = yield api.getReview(action.params);
    if (response.success) {
      const rating = new RatingModel(response.attr?.rating);
      const list = response.data?.map?.((item) => {
        return new CommentModel(item);
      });
      action.callback?.({ list, rating });
    }
  } catch (error) {
    console.log("fetchReview", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* saveComment(action) {
  try {
    const form = new FormData();
    for (let key in action.params) {
      form.append(key, action.params[key]);
    }
    const response = yield api.saveReview(form);
    action.callback?.(response);
  } catch (error) {
    console.log("saveComment", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* loadCategory(action) {
  try {
    const response = yield api.getCategory(action.params);
    if (response.success) {
      const list = response.data?.map?.((item) => {
        return new CategoryNewModel(item);
      });
      action.callback?.(list);
    }
  } catch (error) {
    console.log("getCategory", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* watchLoadProduct() {
  yield takeEvery(actionTypes.FETCH_PRODUCT_DETAIL, fetchProduct);
}

function* watchLoadReview() {
  yield takeEvery(actionTypes.GET_COMMENT, loadReview);
}

function* watchSaveComment() {
  yield takeEvery(actionTypes.SAVE_COMMENT, saveComment);
}

function* watchGetCategory() {
  yield takeEvery(actionTypes.GET_CATEGORY, loadCategory);
}

export default function* authSagas() {
  yield all([
    watchLoadProduct(),
    watchLoadReview(),
    watchSaveComment(),
    watchGetCategory(),
  ]);
}
