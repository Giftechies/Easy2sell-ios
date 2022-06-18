import { all, put, takeEvery } from "redux-saga/effects";
import * as actionTypes from "@actions/actionTypes";
import * as api from "@api";
import { NotificationModel } from "@models";

function* fetchNotification(action) {
  try {
    const response = yield api.getNotification(action.params);
    if (response.success) {
      const list = response.data.map?.((item) => {
        return new NotificationModel(item);
      });
      yield put({
        type: actionTypes.SAVE_NOTIFICATION,
        list,
      });
    }
    action.callback?.(response);
  } catch (error) {
    console.log("fetchNotification", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* watchLoadNotification() {
  yield takeEvery(actionTypes.FETCH_NOTIFICATION, fetchNotification);
}

export default function* authSagas() {
  yield all([watchLoadNotification()]);
}
