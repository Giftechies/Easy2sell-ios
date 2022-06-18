import { all, put, takeEvery } from "redux-saga/effects";
import * as actionTypes from "@actions/actionTypes";
import * as api from "@api";
import { MessageModel } from "@models";

function* fetchMessenger(action) {
  try {
    const response = yield api.getMessage(action.params);
    if (response.success) {
      const message = response.data.map?.((item) => {
        return new MessageModel(item);
      });
      yield put({
        type: actionTypes.SAVE_MESSAGE,
        message,
      });
    }
    action.callback?.(response);
  } catch (error) {
    console.log("fetchMessenger", error);
    action.callback?.(error.response ?? error.message);
  }
}

function* watchLoadMessenger() {
  yield takeEvery(actionTypes.FETCH_MESSAGE, fetchMessenger);
}

export default function* authSagas() {
  yield all([watchLoadMessenger()]);
}
