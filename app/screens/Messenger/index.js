import React, { useState } from "react";
import { RefreshControl, View, FlatList } from "react-native";
import { BaseStyle, useTheme } from "@config";
import { Header, SafeAreaView, ListThumbSquare, Icon, Text } from "@components";
import styles from "./styles";
import { messengerActions } from "@actions";
import { messengerSelect } from "@selectors";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function Messenger({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const messenger = useSelector(messengerSelect);
  const [refreshing, setRefresh] = useState(false);

  /**
   * Reload wishlist
   */
  const onRefresh = () => {
    setRefresh(true);
    dispatch(
      messengerActions.onLoadMessenger(null, () => {
        setRefresh(false);
      })
    );
  };

  /**
   * render Content list
   */
  const renderContent = () => {
    if (messenger.message?.length > 0) {
      return (
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={messenger.message}
          keyExtractor={(item, index) => `messenger ${index}`}
          renderItem={({ item, index }) => (
            <ListThumbSquare
              onPress={() => {
                navigation.navigate("Messages");
              }}
              image={item.image}
              txtLeftTitle={item.name}
              txtContent={item.message}
              txtRight={item.time}
            />
          )}
        />
      );
    }
    if (messenger.message?.length == 0) {
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
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        keyExtractor={(item, index) => `Messages${index}`}
        renderItem={({ item, index }) => <ListThumbSquare loading={true} />}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={t("messenger")} />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={["right", "left", "bottom"]}
      >
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
