import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import { BaseStyle, useTheme, Images } from "@config";
import { Header, SafeAreaView, CouponListItem,ListItem, Text, Icon } from "@components";
import { userSelect } from "@selectors";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as Sharing from "expo-sharing";
import Modal from "react-native-modal";
import { useIsFocused } from "@react-navigation/native";
import * as api from '@api';
import styles from "./styles";
import { createIconSetFromFontello } from "react-native-vector-icons";

export default function Wishlist({ navigation }) {
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useSelector(userSelect);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [page, setPage] = useState(1);


  useEffect(()=>{
    const params = {
        page: page
    };
    getMessages();
  },[])

  
  const getMessages = async(params) => {

    try {
      const response = await api.getGroupedMessages(params);
      if(response.success){
        setLoading(false);
        setRefresh(false);
        if(response?.data?.current_page && response?.data?.current_page==1){
            setMessages(response?.data?.data);
        }else{
            setMessages([...messages, ...response?.data?.data]);
        }
        setPage(response?.data?.current_page+1);
      }
    } catch (error) {
      Alert.alert({
          title: t('loading_messages'),
          message: error.data ?? error.code ?? error.message ?? error.msg,
      });
      //console.log("error");
    }
    
    setLoading(false);
  }

  const loadMore = () => {
    setRefresh(true);
    const params = {
      page: page
    };
    getMessages(params);
  };

  /**
   * Reload wishlist
   */
  const onRefresh = () => {
    setRefresh(true);
    let firstpage=1;
    const params = {
      page: firstpage
    };
    getMessages(params);
  };

  /**
   * render content wishlist
   * @returns
   */
  const renderContent = () => {
    if (messages?.length > 0) {
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
          data={messages}
          onEndReached={()=>loadMore()}
          onEndThreshold={0}
          keyExtractor={(item, index) => `message ${index}`}
          renderItem={({ item, index }) => (
            <ListItem
              small
              image={{uri:item.details.image}}
              title={item?.details?.title}
              subtitle={item.message}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("Messages", {
                  item: item.details,
                  type:item.type,
                  from_id:item.from_id
                })
              }
            />
          )}
        />
      );
    }
    if (messages?.length == 0 && !loading) {
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
        title={t("messages")}
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
