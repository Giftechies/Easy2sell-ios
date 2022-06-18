import React, { useEffect } from "react";
import { ActivityIndicator, View, Alert } from "react-native";
import { Images, useTheme, BaseSetting } from "@config";
import { configActions } from "@actions";
import { useDispatch, useSelector } from "react-redux";
import { Image, Text } from "@components";
import { designSelect, userSelect } from "@selectors";
import * as Font from "expo-font";

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import styles from "./styles";

export default function Loading({ navigation }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const design = useSelector(designSelect);
  const user = useSelector(userSelect);

  /**
   *
   * Override Alert
   */
  Alert.alert = ({ title, message, action, option, type }) => {
    navigation.navigate("Alert", {
      type: type ?? "warning",
      title: title ?? "",
      message: message ?? "",
      action,
      option: option ?? { cancelable: true },
    });
  };

  /**
   *
   * Process when open app
   */
  const onProcess = async () => {
    await Font.loadAsync({
      "Merriweather-Black": require("app/assets/fonts/Merriweather-Black.ttf"),
      "Merriweather-BlackItalic": require("app/assets/fonts/Merriweather-BlackItalic.ttf"),
      "Merriweather-Bold": require("app/assets/fonts/Merriweather-Bold.ttf"),
      "Merriweather-BoldItalic": require("app/assets/fonts/Merriweather-BoldItalic.ttf"),
      "Merriweather-Italic": require("app/assets/fonts/Merriweather-Italic.ttf"),
      "Merriweather-Light": require("app/assets/fonts/Merriweather-Light.ttf"),
      "Merriweather-LightItalic": require("app/assets/fonts/Merriweather-LightItalic.ttf"),
      "Merriweather-Regular": require("app/assets/fonts/Merriweather-Regular.ttf"),
      Merriweather: require("app/assets/fonts/Merriweather-Regular.ttf"),
      "Raleway-Black": require("app/assets/fonts/Raleway-Black.ttf"),
      "Raleway-BlackItalic": require("app/assets/fonts/Raleway-BlackItalic.ttf"),
      "Raleway-Bold": require("app/assets/fonts/Raleway-Bold.ttf"),
      "Raleway-BoldItalic": require("app/assets/fonts/Raleway-BoldItalic.ttf"),
      "Raleway-ExtraBold": require("app/assets/fonts/Raleway-ExtraBold.ttf"),
      "Raleway-ExtraBoldItalic": require("app/assets/fonts/Raleway-ExtraBoldItalic.ttf"),
      "Raleway-ExtraLight": require("app/assets/fonts/Raleway-ExtraLight.ttf"),
      "Raleway-ExtraLightItalic": require("app/assets/fonts/Raleway-ExtraLightItalic.ttf"),
      "Raleway-Italic": require("app/assets/fonts/Raleway-Italic.ttf"),
      "Raleway-Light": require("app/assets/fonts/Raleway-Light.ttf"),
      "Raleway-LightItalic": require("app/assets/fonts/Raleway-LightItalic.ttf"),
      "Raleway-Medium": require("app/assets/fonts/Raleway-Medium.ttf"),
      "Raleway-MediumItalic": require("app/assets/fonts/Raleway-MediumItalic.ttf"),
      "Raleway-Regular": require("app/assets/fonts/Raleway-Regular.ttf"),
      Raleway: require("app/assets/fonts/Raleway-Regular.ttf"),
      "Raleway-SemiBold": require("app/assets/fonts/Raleway-SemiBold.ttf"),
      "Raleway-SemiBoldItalic": require("app/assets/fonts/Raleway-SemiBoldItalic.ttf"),
      "Raleway-Thin": require("app/assets/fonts/Raleway-Thin.ttf"),
      "Raleway-ThinItalic": require("app/assets/fonts/Raleway-ThinItalic.ttf"),
      "Roboto-Black": require("app/assets/fonts/Roboto-Black.ttf"),
      "Roboto-BlackItalic": require("app/assets/fonts/Roboto-BlackItalic.ttf"),
      "Roboto-Bold": require("app/assets/fonts/Roboto-Bold.ttf"),
      "Roboto-BoldItalic": require("app/assets/fonts/Roboto-BoldItalic.ttf"),
      "Roboto-Italic": require("app/assets/fonts/Roboto-Italic.ttf"),
      "Roboto-Light": require("app/assets/fonts/Roboto-Light.ttf"),
      "Roboto-LightItalic": require("app/assets/fonts/Roboto-LightItalic.ttf"),
      "Roboto-Medium": require("app/assets/fonts/Roboto-Medium.ttf"),
      "Roboto-MediumItalic": require("app/assets/fonts/Roboto-MediumItalic.ttf"),
      "Roboto-Regular": require("app/assets/fonts/Roboto-Regular.ttf"),
      Roboto: require("app/assets/fonts/Roboto-Regular.ttf"),
      "Roboto-Thin": require("app/assets/fonts/Roboto-Thin.ttf"),
      "Roboto-ThinItalic": require("app/assets/fonts/Roboto-ThinItalic.ttf"),
      Poppins: require("app/assets/fonts/Poppins/Poppins-Regular.ttf"),
      "Poppins-Regular": require("app/assets/fonts/Poppins/Poppins-Regular.ttf"),
      "Poppins-Black": require("app/assets/fonts/Poppins/Poppins-Black.ttf"),
      "Poppins-BlackItalic": require("app/assets/fonts/Poppins/Poppins-BlackItalic.ttf"),
      "Poppins-Bold": require("app/assets/fonts/Poppins/Poppins-Bold.ttf"),
      "Poppins-BoldItalic": require("app/assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
      "Poppins-Light": require("app/assets/fonts/Poppins/Poppins-Light.ttf"),
      "Poppins-LightItalic": require("app/assets/fonts/Poppins/Poppins-LightItalic.ttf"),
      "Poppins-Medium": require("app/assets/fonts/Poppins/Poppins-Medium.ttf"),
      "Poppins-MediumItalic": require("app/assets/fonts/Poppins/Poppins-MediumItalic.ttf"),
    });

    dispatch(
      configActions.onSetup(
        design ?? BaseSetting.defaultDesign,
        user,
        (response) => {
          navigation.replace("Main");
        }
      )
    );
  };

  /**
   *
   * Mount
   */
  useEffect(() => {
    onProcess();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
      <Image
            style={styles.logo}
            resizeMode="contain"
            source={Images.logo}
          />
        {/* <SvgCssUri uri={resolveAssetSource(Images.logo1).uri} style={styles.logo} width="250" height="100" resizeMode="contain" /> */}
        {/* <Text title1 style={{ marginTop: 8 }}> 
          {BaseSetting.displayName}
        </Text> */}
        <Text grayColor headline>
          A Platform
        </Text>
        <Text grayColor headline numberOfLines={2}>
          to Buy & Sell anything
        </Text>
      </View>
      <ActivityIndicator
        size="large"
        color={colors.text}
        style={styles.loading}
      />
    </View>
  );
}
