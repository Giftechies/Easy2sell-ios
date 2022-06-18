import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  TouchableOpacity,
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
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(userSelect);
  const wishlist = useSelector(wishlistSelect);
  const [modalVisible, setModalVisible] = useState(false);

  const [refreshing, setRefresh] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionItem, setActionItem] = useState(null);


  useEffect(()=>{
    if(!wishlist?.list?.length){
      getWish();
    }
  },[isFocused])

  const getWish = () => {
    // let params = {
    //   api_token:user.token
    // }
    dispatch(wishListActions.onLoad());
  }
  /**
   * Reload wishlist
   */
  const onRefresh = () => {
    setRefresh(false);
  };

  /**
   * Action Delete/Reset
   **/
  const onDelete = async (item) => {
    setDeleting(true);
    let params = {
      item_id:item?.home?.id ?? item?.construction?.id ?? item?.vehicle?.id ?? item?.job?.id ?? item?.coupon?.id ?? item?.item?.id,
      type:item.type.toLowerCase()
    }
    const response = await api.addRemoveWish(params);
    if(response.success){
      getWish();
    }
    // setTimeout(() => {
    //   dispatch(wishListActions.onDelete(item));
    //   setDeleting(false);
    // }, 1000);
  };

  /**
   * Action for share
   */
  const onShare = async (item) => {
    try {
      await Sharing.shareAsync(item.link);
    } catch (error) {}
    setModalVisible(false);
  };

  /**
   * render UI Modal action
   * @returns
   */
  const renderModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setActionItem(null);
        }}
        swipeDirection={["down"]}
        style={styles.bottomModal}
      >
        <SafeAreaView
          style={[styles.contentFilterBottom, { backgroundColor: colors.card }]}
        >
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setActionItem(null);
            }}
          >
            <Icon name="times" size={12} color={colors.text} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              onShare(actionItem);
            }}
            style={[
              styles.contentActionModalBottom,
              { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
          >
            <Icon name="share" size={18} color={colors.text} />
            <Text body2 semibold style={{ marginLeft: 15 }}>
              {t("share")}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.contentActionModalBottom]}
            onPress={() => {
              setModalVisible(false);
              onDelete(actionItem);
            }}
          >
            <Icon name="trash-alt" size={18} color={colors.text} />
            <Text body2 semibold style={{ marginLeft: 15 }}>
              {t("remove")}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  };

  /**
   * render content wishlist
   * @returns
   */
  const renderContent = () => {
    if (wishlist.list?.length > 0) {
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
          data={wishlist.list}
          keyExtractor={(item, index) => `wishlist ${index}`}
          renderItem={({ item, index }) => (
            item.type == 'property' ?
            <ListItem
              small
              enableAction={true}
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
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:item.type == 'construction' ?
            <ListItem
              small
              enableAction={true}
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
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:item.type=='vehicle'?
            <ListItem
              small
              enableAction={true}
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
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:item.type=='coupon'?
            <ListItem
              enableAction={true}
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
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:item.type == 'job'?
            <ListItem
              small
              enableAction={true}
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
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:item.type == 'item'?
            <ListItem
              small
              enableAction={true}
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
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:''
          )}
        />
      );
    }
    if (wishlist.list?.length == 0) {
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
        title={t("wishlist")}
        // renderRight={() => {
        //   if (deleting) {
        //     return <ActivityIndicator size="small" color={colors.primary} />;
        //   }
        //   return <Icon name="trash-alt" size={16} color={colors.text} />;
        // }}
        // onPressRight={() => onDelete()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={["right", "left"]}>
        {renderModal()}
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
