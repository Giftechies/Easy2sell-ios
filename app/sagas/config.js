import { all, put, takeEvery, delay } from "redux-saga/effects";
import * as actionTypes from "@actions/actionTypes";
import * as api from "@api";
import { SettingModel } from "@models";

export function* onSetup(action) {
  yield put({ type: actionTypes.SAVE_HOME_DATA }); //Clear Home
  yield put({ type: actionTypes.SAVE_WISHLIST }); // Clear old wishlist
  yield put({ type: actionTypes.SAVE_DESIGN, design: action.design });
  try {
    const response = yield api.getSetting();
    if (response.success) {
      const setting = new SettingModel(response.data);
      yield put({ type: actionTypes.SAVE_SETTING, setting });
    }
  } catch (error) {}

  if (action.user) {
    yield put({
      type: actionTypes.VALID_TOTEN,
      callback: action.callback,
      design: action.design,
    });
  } else {
    action.callback?.();
  }
}

export function* onFetchData(action) {
  yield put({ type: actionTypes.FETCH_NOTIFICATION });
  yield put({ type: actionTypes.FETCH_HOME, design: action.design });
  yield put({ type: actionTypes.GET_WISHLIST });
}

function* watchSetup() {
  yield takeEvery(actionTypes.SETUP_CONFIG, onSetup);
}

function* watchChangeDesign() {
  yield takeEvery(actionTypes.SAVE_DESIGN, onFetchData);
}

export default function* configSagas() {
  yield all([watchSetup(), watchChangeDesign()]);
}
