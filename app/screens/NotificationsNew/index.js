import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  View,
  Alert
} from "react-native";
import { BaseStyle, useTheme } from "@config";
import { Header, SafeAreaView, CouponListItem,ListItem, Text, Icon } from "@components";
import { wishlistSelect,userSelect } from "@selectors";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { wishListActions } from "@actions";
import * as Sharing from "expo-sharing";
import Modal from "react-native-modal";
import { useIsFocused } from "@react-navigation/native";
import * as api from '@api';
import styles from "./styles";

export default function Wishlist({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useSelector(userSelect);

  const [refreshing, setRefresh] = useState(false);
  const [notifications, setNotifications] = useState([]);


  useEffect(()=>{
    getNotifications();
  },[])

  const getNotifications = async () => {
    try {
        const response = await api.getNotifications();
        if(response.success){
          setNotifications(response.data);
          setRefresh(false);
        }
      } catch (error) {
        Alert.alert({
            title: t('loading_notifications'),
            message: error.data ?? error.code ?? error.message ?? error.msg,
        });
      }
  }
  /**
   * Reload wishlist
   */
  const onRefresh = () => {
    setRefresh(false);
  };

  /**
   * render content wishlist
   * @returns
   */
  const renderContent = () => {
    console.log(notifications?.length);
    if (notifications?.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{ paddingTop: 15 }}
          style={styles.contentList}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={notifications}
          keyExtractor={(item, index) => `wishlist ${index}`}
          renderItem={({ item, index }) => (
            item.type == 'property' ?
            <ListItem
              small
              image={{uri:item.home.image}}
              title={item.home.title}
              subtitle={item.home.property_type}
              rate={item.rate}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.home,
                  type:'property'
                })
              }
              
            />:item.type == 'construction' ?
            <ListItem
              small
              title={item.construction.title}
              image={{uri:item.construction.image}}
              subtitle={item.construction.category_name}
              status={item.construction.status}
              //image={item.image}
              address={item.construction.location}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.construction,
                  type:'construction'
                })
              }
              
            />:item.type=='vehicle'?
            <ListItem
              small
              title={item.vehicle.title}
              subtitle={item.vehicle.category_name}
              image={{uri:item.vehicle.image}}
              address={item.vehicle.location}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.vehicle,
                  type:'vehicle'
                })
              }
              
            />:item.type=='coupon'?
            <ListItem
                small
              title={item.coupon.title}
              subtitle={item.coupon.code}
              status={item.coupon.status}
              image={{uri:item.coupon.image}}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.coupon,
                  type:'coupon'
                })
              }
              
            />:item.type == 'job'?
            <ListItem
              small
              image={{uri:item.job.image}}
              title={item.job.title}
              subtitle={item.job.category_name}
              status={item.job.status}
              //image={item.image}
              address={item.job.location}
              phone={item.job.salary_type}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.job,
                  type:'job'
                })
              }
              
            />:item.type == 'item'?
            <ListItem
              small
              image={{uri:item.item.image}}
              title={item.item.title}
              subtitle={item.item.category_name}
              location={item.item.location}
              //phone={item.phone}
              status={item.item.price}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.item,
                  type:'item'
                })
              }
              
            />:''
          )}
        />
      );
    }
    if (notifications?.length == 0) {
      return (
        <View style={styles.loadingContent}>
          <View style={{ alignItems: "center" }}>
            <Icon
              name="frown-open"
              size={18}
              color={colors.text}
              style={{ marginBottom: 4 }}
            />
            <Text>{t("data_not_found")}</Text>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={{ paddingTop: 15 }}
        style={styles.contentList}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        keyExtractor={(item, index) => `empty ${index}`}
        renderItem={({ item, index }) => (
          <ListItem small loading={true} style={{ marginBottom: 15 }} />
        )}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t("notifications")}
        renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={colors.primary} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        // renderRight={() => {
        //   if (deleting) {
        //     return <ActivityIndicator size="small" color={colors.primary} />;
        //   }
        //   return <Icon name="trash-alt" size={16} color={colors.text} />;
        // }}
        // onPressRight={() => onDelete()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={["right", "left"]}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
