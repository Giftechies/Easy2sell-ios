import React from "react";
import { store, persistor } from "app/store";
import { Provider } from "react-redux";
import { Platform, StyleSheet } from 'react-native';
import { PersistGate } from "redux-persist/integration/react";
import Navigator from "./navigation";
import OneSignal from 'react-native-onesignal';
import RNDrawOverlay from 'react-native-draw-overlay';

console.disableYellowBox = true;

export default function App() {
  const getID = () => store.getState().auth?.user?.id;

  //OneSignal Init Code
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("1e61fc39-2b15-45f2-9eb2-af90249ff4ea");
  //END OneSignal Init Code


  // RNDrawOverlay.askForDispalayOverOtherAppsPermission()
  //   .then(res => {
  //     // res will be true if permission was granted 
  //     console.log('granted');
  //   })
  //   .catch(e => {
  //     // permission was declined
  //     console.log('denied');
  //   })


  //OneSignal.sendTag('user_type','android');
  //OneSignal.registerForPushNotifications();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
            <Navigator />
      </PersistGate>
    </Provider>
  );
}
