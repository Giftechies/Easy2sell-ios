import { combineReducers } from "redux";
import authReducer from "./auth";
import applicationReducer from "./application";
import configReducer from "./config";
import wishlistReducer from "./wishlist";
import homeReducer from "./home";
import listReducer from "./list";
import messageReducer from "./message";
import notificationReducer from "./notification";

export default combineReducers({
  auth: authReducer,
  application: applicationReducer,
  config: configReducer,
  wishlist: wishlistReducer,
  home: homeReducer,
  list: listReducer,
  messenger: messageReducer,
  notification: notificationReducer,
});
