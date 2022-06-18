import React, { useState } from "react";
import { RefreshControl, View, FlatList } from "react-native";
import { BaseStyle, useTheme } from "@config";
import { useTranslation } from "react-i18next";
import { Header, SafeAreaView, Icon, Text, ListThumbCircle } from "@components";
import { notificationActions } from "@actions";
import { notificationSelect } from "@selectors";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";

export default function Notification({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const notification = useSelector(notificationSelect);
  const [refreshing, setRefresh] = useState(false);

  /**
   * Reload wishlist
   */
  const onRefresh = () => {
    setRefresh(true);
    dispatch(
      notificationActions.onLoadNotification(null, () => {
        setRefresh(false);
      })
    );
  };

  /**
   * render Content list
   */
  const renderContent = () => {
    if (notification.list?.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={notification.list}
          keyExtractor={(item, index) => `Notification ${index}`}
          renderItem={({ item, index }) => (
            <ListThumbCircle
              image={item.image}
              txtLeftTitle={item.title}
              txtContent={item.description}
              txtRight={item.time}
              style={{ marginBottom: 5 }}
            />
          )}
        />
      );
    }
    if (notification.list?.length == 0) {
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        keyExtractor={(item, index) => `Notification${index}`}
        renderItem={({ item, index }) => <ListThumbCircle loading={true} />}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t("notification")}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={["right", "left"]}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
