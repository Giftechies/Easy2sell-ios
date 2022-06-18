import React, { useEffect } from "react";
import { StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import { useTheme, BaseSetting } from "@config";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useSelector } from "react-redux";
import { languageSelect, designSelect } from "@selectors";


/* Main Stack Navigator */
import Main from "app/navigation/main";
/* Modal Screen only affect iOS */
import Loading from "@screens/Loading";
import Filter from "@screens/Filter";
import PickerScreen from "@screens/PickerScreen";
import SearchHistory from "@screens/SearchHistory";
import SearchHistoryRealEstate from "@screens/SearchHistoryRealEstate";
import SearchHistoryEvent from "@screens/SearchHistoryEvent";
import SearchHistoryFood from "@screens/SearchHistoryFood";
import PreviewImage from "@screens/PreviewImage";
import SelectDarkOption from "@screens/SelectDarkOption";
import SelectFontOption from "@screens/SelectFontOption";
import AlertScreen from "@screens/Alert";
import ChooseBusiness from "@screens/ChooseBusiness";
import SignIn from "@screens/SignIn";
import SignUp from "@screens/SignUp";
import ResetPassword from "@screens/ResetPassword";
import ProductDetail from "@screens/ProductDetail";
import Package from "@screens/Package";
import ProductDetailRealEsate from "@screens/ProductDetailRealEsate";
import ProductDetailEvent from "@screens/ProductDetailEvent";
import ProductDetailFood from "@screens/ProductDetailFood";
import Notification from "@screens/Notification";
import NotificationsNew from "@screens/NotificationsNew";
import {AddVehicle, AddItem, AddCoupon, AddJob, AddRealEstate, AddConstruction} from "@screens/Forms";
import {EditVehicle, EditItem, EditCoupon, EditJob, EditRealEstate, EditConstruction} from "@screens/FormsEdit";
import {ListingCategories, MyListing} from "@screens/UserInnerPages";
import CommonSelectModel from "@screens/CommonSelectModel";
import CommonSelectModelB from "@screens/CommonSelectModelB";
import CommonMultiSelectModel from "@screens/CommonMultiSelectModel";
import CommonMultiSelectModelB from "@screens/CommonMultiSelectModelB";
import ImageBrowser from "@screens/ImageBrowser";
import ItemCategories from "@screens/ItemCategories";
import NotificationPreference from "@screens/NotificationPreference";
import Messages from "@screens/Messages";
import List from "@screens/List";

const RootStack = createStackNavigator();

export default function Navigator() {
  const language = useSelector(languageSelect);
  const design = useSelector(designSelect);

  const { theme, colors } = useTheme();
  const isDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
    });
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.white, true);
    }
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content", true);
  }, [colors.white, isDarkMode]);

  /**
   * fade animate trasition navigation
   * @param {*} {current, closing}
   */
  const forFade = ({ current, closing }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  /**
   * Main follow return SearchHistory design you are selected
   * @param {*} design  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportSearchHistory = (design) => {
    switch (design) {
      case "real_estate":
        return SearchHistoryRealEstate;
      case "event":
        return SearchHistoryEvent;
      case "food":
        return SearchHistoryFood;
      default:
        return SearchHistory;
    }
  };

  /**
   * Main follow return  Product detail design you are selected
   * @param {*} design  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportProductDetail = (design) => {
    switch (design) {
      case "real_estate":
        return ProductDetailRealEsate;
      case "event":
        return ProductDetailEvent;
      case "food":
        return ProductDetailFood;
      default:
        return ProductDetail;
    }
  };

  /**
   * Main follow return  Product detail design you are selected
   * @param {*} design  ['basic', 'real_estate','event', 'food']
   * @returns
   */
   const exportList = (design) => {
    switch (design) {
      case "real_estate":
        return ListRealEstate;
      case "event":
        return ListEvent;
      case "food":
        return ListFood;
      default:
        return List;
    }
  };

  return (
    <AppearanceProvider>
      <NavigationContainer theme={theme}>
          <RootStack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="Loading"
          >
          <RootStack.Screen
            name="Loading"
            component={Loading}
            options={{ gestureEnabled: false }}
          />
          
          <RootStack.Screen name="List" component={exportList(design)} />
          <RootStack.Screen name="Messages" component={Messages} />
          <RootStack.Screen name="NotificationPreference" component={NotificationPreference} />
          <RootStack.Screen name="SignIn" component={SignIn} />
          <RootStack.Screen name="ItemCategories" component={ItemCategories} />
          <RootStack.Screen name="SignUp" component={SignUp} />
          <RootStack.Screen name="Package" component={Package} />
          <RootStack.Screen name="CommonSelectModel" component={CommonSelectModel} />
          <RootStack.Screen name="CommonSelectModelB" component={CommonSelectModelB} />
          <RootStack.Screen name="CommonMultiSelectModel" component={CommonMultiSelectModel} />
          <RootStack.Screen name="CommonMultiSelectModelB" component={CommonMultiSelectModelB} />
          <RootStack.Screen name="ResetPassword" component={ResetPassword} />
          <RootStack.Screen name="ListingCategories" component={ListingCategories} />
          <RootStack.Screen name="MyListing" component={MyListing} />
          <RootStack.Screen name="AddVehicle" component={AddVehicle} />
          <RootStack.Screen name="AddItem" component={AddItem} />
          <RootStack.Screen name="AddCoupon" component={AddCoupon} />
          <RootStack.Screen name="AddJob" component={AddJob} />
          <RootStack.Screen name="AddRealEstate" component={AddRealEstate} />
          <RootStack.Screen name="AddConstruction" component={AddConstruction} />
          <RootStack.Screen name="EditVehicle" component={EditVehicle} />
          <RootStack.Screen name="EditItem" component={EditItem} />
          <RootStack.Screen name="EditCoupon" component={EditCoupon} />
          <RootStack.Screen name="EditJob" component={EditJob} />
          <RootStack.Screen name="EditRealEstate" component={EditRealEstate} />
          <RootStack.Screen name="EditConstruction" component={EditConstruction} />
          <RootStack.Screen name="ImageBrowser" component={ImageBrowser} />
          
          <RootStack.Screen
            name="Alert"
            component={AlertScreen}
            options={{
              presentation: "transparentModal",
              cardStyleInterpolator: forFade,
              cardStyle: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              gestureEnabled: false,
            }}
          />
          <RootStack.Screen
            name="ChooseBusiness"
            component={ChooseBusiness}
            options={{
              presentation: "transparentModal",
              cardStyleInterpolator: forFade,
              cardStyle: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              gestureEnabled: false,
            }}
          />
          <RootStack.Screen name="Main" component={Main} />
          <RootStack.Screen name="Filter" component={Filter} />
          <RootStack.Screen name="PickerScreen" component={PickerScreen} />
          <RootStack.Screen name="Notification" component={Notification} />
          <RootStack.Screen name="NotificationsNew" component={NotificationsNew} />
          <RootStack.Screen
            name="SearchHistory"
            component={exportSearchHistory(design)}
          />
          <RootStack.Screen
            name="ProductDetail"
            component={exportProductDetail(design)}
          />
          <RootStack.Screen name="PreviewImage" component={PreviewImage} />
          <RootStack.Screen
            name="SelectDarkOption"
            component={SelectDarkOption}
            gestureEnabled={false}
            options={{
              presentation: "transparentModal",
              cardStyleInterpolator: forFade,
              cardStyle: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            }}
          />
          <RootStack.Screen
            name="SelectFontOption"
            component={SelectFontOption}
            gestureEnabled={false}
            options={{
              presentation: "transparentModal",
              cardStyleInterpolator: forFade,
              cardStyle: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}
