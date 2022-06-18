import {
  Header,
  Image,
  SafeAreaView,
  Text,
  Icon,
  FoodListItem,
  ProfileCall,
} from "@components";
import { BaseColor, BaseStyle, Images, useTheme } from "@config";
import * as Utils from "@utils";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  ScrollView,
  Share,
  View,
  Alert,
  Linking,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles";
import { userSelect, wishlistSelect, designSelect } from "@selectors";
import { productActions, wishListActions } from "@actions";
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from "rn-placeholder";

export default function ProductDetailFood({ navigation, route }) {
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const item = route.params?.item;
  const dispatch = useDispatch();
  const user = useSelector(userSelect);
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const { colors } = useTheme();

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(false);
  const [product, setProduct] = useState(null);

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [BaseColor.whiteColor, colors.text],
    extrapolate: "clamp",
    useNativeDriver: true,
  });

  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader - 20],
    outputRange: [1, 0],
    extrapolate: "clamp",
    useNativeDriver: true,
  });

  const heightViewImg = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader],
    outputRange: [250, heightHeader],
    useNativeDriver: true,
  });

  useEffect(() => {
    dispatch(
      productActions.onLoadProduct(item.id, design, null, (item) => {
        setProduct(item);
        setLoading(false);
        setLike(item.favorite);
      })
    );
  }, [design, dispatch, item.id]);

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = (item) => {
    return wishlist.list?.some((i) => i.id === item.id);
  };

  /**
   * on Share
   */
  const onShare = async () => {
    try {
      await Share.share({
        message: "https://codecanyon.net/user/passionui/portfolio",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * go product detail
   * @param {*} item
   */
  const onProductDetail = (item) => {
    navigation.replace("ProductDetail", { item: item });
  };

  /**
   * on Review action
   */
  const onReview = () => {
    if (user) {
      navigation.navigate({
        name: "Review",
      });
    } else {
      navigation.navigate({
        name: "SignIn",
        params: {
          success: () => {
            navigation.navigate({
              name: "Review",
            });
          },
        },
      });
    }
  };

  /**
   * on Messenger
   */
  const onPressMessenger = () => {
    if (user) {
      navigation.navigate({
        name: "Messages",
      });
    } else {
      navigation.navigate({
        name: "SignIn",
        params: {
          success: () => {
            navigation.navigate({
              name: "Messages",
            });
          },
        },
      });
    }
  };

  /**
   * like action
   * @param {*} like
   */
  const onLike = (like) => {
    if (user) {
      setLike(null);
      dispatch(wishListActions.onUpdate(item));
      setLike(like);
    } else {
      navigation.navigate({
        name: "SignIn",
        params: {
          success: () => {
            dispatch(wishListActions.onUpdate(item));
            setLike(like);
          },
        },
      });
    }
  };

  /**
   * Open action
   * @param {*} item
   */
  const onOpen = (type, title, link) => {
    Alert.alert({
      title: title,
      message: `${t("do_you_want_open")} ${title} ?`,
      action: [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("done"),
          onPress: () => {
            switch (type) {
              case "web":
                Linking.openURL(link);
                break;
              case "phone":
                Linking.openURL("tel://" + link);
                break;
              case "email":
                Linking.openURL("mailto:" + link);
                break;
              case "address":
                Linking.openURL(link);
                break;
            }
          },
        },
      ],
    });
  };

  /**
   * render Slider content
   * @return {*}
   */
  const renderBanner = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <PlaceholderMedia style={{ width: "100%", height: "100%" }} />
        </Placeholder>
      );
    }

    return (
      <Image style={{ width: "100%", height: "100%" }} source={product.image} />
    );
  };

  /**
   * render wishlist status
   *
   */
  const renderLike = () => {
    return (
      <TouchableOpacity onPress={() => onLike(!like)}>
        {like ? (
          <Icon name="heart" color={colors.primaryLight} solid size={18} />
        ) : (
          <Icon name="heart" color={colors.primaryLight} size={18} />
        )}
      </TouchableOpacity>
    );
  };

  /**
   * render Content UI
   * @return {*}
   */
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.content}>
          <Placeholder Animation={Progressive}>
            <PlaceholderLine
              style={{ width: "90%", height: 20, marginTop: 70 }}
            />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
          </Placeholder>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <View
          style={[
            styles.boxInfo,
            {
              backgroundColor: colors.card,
              shadowColor: colors.border,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={{ flext: 1 }}>
            <Text title1 semibold numberOfLines={1}>
              {product.title}
            </Text>
            <View style={styles.contentStatus}>
              <Text caption2 accentColor medium>
                {product.status}
              </Text>
              <View style={styles.dot} />
              <Text caption2 grayColor style={{ flex: 1 }} numberOfLines={1}>
                {product.subtitle}
              </Text>
            </View>
            <View style={styles.contentStatus}>
              <TouchableOpacity
                onPress={onReview}
                style={[
                  styles.tagRate,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Icon
                  name="star"
                  size={10}
                  color={BaseColor.whiteColor}
                  solid
                />
                <Text caption2 whiteColor semibold style={{ marginLeft: 4 }}>
                  {product.rate}
                </Text>
              </TouchableOpacity>
              <View style={styles.dot} />
              <Text caption2 numberOfLines={1}>
                {product.distance}
              </Text>
              <View style={styles.dot} />
              <Text caption2 numberOfLines={1}>
                {product.promotion}
              </Text>
            </View>
          </View>
          <View style={styles.boxContentLeft}>
            <View
              style={[
                styles.promotionTag,
                { backgroundColor: colors.primary + "4D" },
              ]}
            >
              <Text overline medium primaryColor>
                {t("discount")}
              </Text>
            </View>
            {renderLike()}
          </View>
        </View>
        <ProfileCall
          image={product.author?.image}
          title={product.author?.name}
          subtitle={product.author?.level}
          onPressMessenger={() => onPressMessenger()}
          onPressPhone={() => onOpen("phone", t("tel"), product.phone)}
        />
        <TouchableOpacity
          style={styles.aboutRow}
          onPress={() => {
            const location = `${product.location?.latitude},${product.location?.longitude}`;
            const url = Platform.select({
              ios: `maps:${location}`,
              android: `geo:${location}?center=${location}&q=${location}&z=16`,
            });
            onOpen("address", t("address"), url);
          }}
        >
          <View
            style={[styles.contentIcon, { backgroundColor: colors.border }]}
          >
            <Icon
              name="map-marker-alt"
              size={16}
              color={BaseColor.whiteColor}
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text caption2 grayColor>
              {t("address")}
            </Text>
            <Text footnote semibold style={{ marginTop: 5 }}>
              {product.address}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.aboutRow}
          onPress={() => {
            onOpen("phone", t("tel"), product.phone);
          }}
        >
          <View
            style={[styles.contentIcon, { backgroundColor: colors.border }]}
          >
            <Icon name="mobile-alt" size={16} color={BaseColor.whiteColor} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text caption2 grayColor>
              {t("tel")}
            </Text>
            <Text footnote semibold style={{ marginTop: 5 }}>
              {product.phone}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.aboutRow}
          onPress={() => {
            onOpen("envelope", t("envelope"), product.email);
          }}
        >
          <View
            style={[styles.contentIcon, { backgroundColor: colors.border }]}
          >
            <Icon name="envelope" size={16} color={BaseColor.whiteColor} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text caption2 grayColor>
              {t("email")}
            </Text>
            <Text footnote semibold style={{ marginTop: 5 }}>
              {product.email}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.aboutRow}
          onPress={() => {
            onOpen("web", t("website"), product.website);
          }}
        >
          <View
            style={[styles.contentIcon, { backgroundColor: colors.border }]}
          >
            <Icon name="globe" size={16} color={BaseColor.whiteColor} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text caption2 grayColor>
              {t("website")}
            </Text>
            <Text footnote semibold style={{ marginTop: 5 }}>
              {product.website}
            </Text>
          </View>
        </TouchableOpacity>
        <Text
          title3
          bold
          style={{
            marginTop: 20,
          }}
        >
          {t("products")}
        </Text>
        <Text
          body2
          grayColor
          style={{
            marginTop: 4,
            marginBottom: 15,
          }}
        >
          {t("best_price_tasty")}
        </Text>
        {product.nearlys.map((item, index) => {
          return (
            <FoodListItem
              key={`Products ${index}`}
              list
              title={item.title}
              subtitle={item.subtitle}
              status={item.status}
              image={item.image}
              address={item.address}
              favorite={isFavorite(item)}
              style={{ marginBottom: 15 }}
              onPress={() => onProductDetail(item)}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={product?.title ?? ""} />
      <Animated.View
        style={[
          styles.headerImageStyle,
          {
            opacity: headerImageOpacity,
            height: heightViewImg,
          },
        ]}
      >
        {renderBanner()}
      </Animated.View>
      <Animated.View style={[styles.headerStyle, { position: "absolute" }]}>
        <Header
          title=""
          renderLeft={() => {
            return (
              <Animated.Image
                resizeMode="contain"
                style={[
                  styles.icon,
                  {
                    tintColor: headerBackgroundColor,
                  },
                ]}
                source={Images.back}
              />
            );
          }}
          renderRightSecond={() => {
            return (
              <View style={styles.iconContent}>
                <Animated.Image
                  resizeMode="contain"
                  style={[
                    styles.icon,
                    {
                      tintColor: headerBackgroundColor,
                    },
                  ]}
                  source={Images.gallery}
                />
              </View>
            );
          }}
          renderRight={() => {
            return (
              <View style={styles.iconContent}>
                <Animated.Image
                  resizeMode="contain"
                  style={[
                    styles.icon,
                    {
                      tintColor: headerBackgroundColor,
                    },
                  ]}
                  source={Images.share}
                />
              </View>
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={onShare}
          onPressRightSecond={() => {
            navigation.navigate("PreviewImage", {
              gallery: product.gallerys,
            });
          }}
        />
      </Animated.View>
      <SafeAreaView style={BaseStyle.safeAreaView} edges={["left", "right"]}>
        <ScrollView
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          overScrollMode={"never"}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: scrollY },
                },
              },
            ],
            {
              useNativeDriver: false,
            }
          )}
        >
          <View style={{ height: 170 - heightHeader }} />
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
