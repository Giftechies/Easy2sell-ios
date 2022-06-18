import {
  Header,
  Image,
  SafeAreaView,
  Text,
  Tag,
  StarRating,
  ProfileCall,
  ProfileGroup,
  EventListItem,
  Icon,
} from "@components";
import { BaseColor, BaseStyle, Images, useTheme } from "@config";
import * as Utils from "@utils";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  Animated,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles";
import { userSelect, wishlistSelect, designSelect } from "@selectors";
import { productActions, wishListActions } from "@actions";
import Swiper from "react-native-swiper";
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from "rn-placeholder";

export default function ProductDetailRealEsate({ navigation, route }) {
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
      productActions.onLoadProduct(item.id, design,null, (item) => {
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
    } catch (error) {}
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
  const renderSlider = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <PlaceholderMedia style={{ width: "100%", height: "100%" }} />
        </Placeholder>
      );
    }

    return (
      <>
        <Swiper
          dotStyle={{
            backgroundColor: colors.border,
            marginBottom: 16,
          }}
          activeDotStyle={{
            marginBottom: 16,
          }}
          paginationStyle={{ bottom: 0 }}
          loop={false}
          activeDotColor={colors.primary}
          removeClippedSubviews={false}
        >
          {product.gallerys?.slice(0, 5).map((item, index) => {
            return (
              <TouchableOpacity
                key={`banner${index}`}
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate("PreviewImage", {
                    gallery: product.gallerys,
                  });
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={item.full}
                />
              </TouchableOpacity>
            );
          })}
        </Swiper>
        <View style={styles.contentRate}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Tag rate onPress={onReview}>
              {product.rate}
            </Tag>
            <View style={{ marginLeft: 10 }}>
              <Text caption1 whiteColor semibold style={{ marginBottom: 5 }}>
                {product.rateStatus}
              </Text>
              <StarRating
                disabled={true}
                starSize={10}
                maxStars={5}
                rating={product.rate}
                selectedStar={onReview}
                fullStarColor={BaseColor.yellowColor}
              />
            </View>
          </View>
          <Text caption1 semibold whiteColor style={{ marginTop: 5 }}>
            {product.numberRate} {t("reviews")}
          </Text>
        </View>
      </>
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
            <PlaceholderLine style={{ width: "90%", height: 20 }} />
          </Placeholder>
        </View>
      );
    }

    const time = product.date?.split(" ");
    return (
      <View style={styles.content}>
        <Text title1 semibold numberOfLines={1}>
          {product.title}
        </Text>
        <View style={[styles.lineSpace, { marginTop: 20 }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.calendarIcon}>
              <Text footnote lightPrimaryColor medium>
                {time[2]}
              </Text>
              <Text headline semibold>
                {time[1]}
              </Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text headline semibold>
                {time[0]}
              </Text>
              <Text subhead accentColor medium style={{ marginTop: 5 }}>
                {product.time}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.bookBtn, { backgroundColor: colors.primary + "4D" }]}
          >
            <Text semibold primaryColor>
              {t("book_now")}
            </Text>
          </TouchableOpacity>
        </View>
        <ProfileGroup
          users={[
            { image: Images.profile3 },
            { image: Images.profile4 },
            { image: Images.profile5 },
          ]}
          name="Steve, Lincoln, Harry"
          detail="and 15 people like this"
          style={{ marginTop: 10 }}
        />
        <View
          style={[
            styles.line,
            { backgroundColor: colors.border, marginTop: 20 },
          ]}
        />
        <Text
          headline
          semibold
          style={{
            marginTop: 20,
          }}
        >
          {t("about")}
        </Text>
        <TouchableOpacity
          style={[styles.aboutRow, { marginTop: 10 }]}
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
        <ProfileCall
          image={product.author?.image}
          title={product.author?.name}
          subtitle={product.author?.level}
          style={{ paddingVertical: 20 }}
          onPressMessenger={() => onPressMessenger()}
          onPressPhone={() => onOpen("phone", t("tel"), product.phone)}
        />
        <Text headline semibold style={{ paddingVertical: 10 }}>
          {t("description")}
        </Text>
        <Text body2 style={{ lineHeight: 20 }}>
          {product.description}
        </Text>
        <View
          style={{
            height: 180,
            marginVertical: 20,
          }}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: product.location?.latitude,
              longitude: product.location?.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.004,
            }}
          >
            <Marker
              coordinate={{
                latitude: product.location?.latitude,
                longitude: product.location?.longitude,
              }}
            />
          </MapView>
        </View>
        <Text headline semibold>
          {t("nearly_event")}
        </Text>
        <Text body2 grayColor>
          {t("let_find_more_event")}
        </Text>
        <View style={{ paddingVertical: 15 }}>
          {product.nearlys?.map((item, index) => {
            return (
              <EventListItem
                key={`nearlys ${index}`}
                list
                title={item.title}
                subtitle={item.date}
                status={item.status}
                image={item.image}
                price={item.price}
                address={item.address}
                location={item.location}
                favorite={isFavorite(item)}
                onPress={() => onProductDetail(item)}
                style={{ marginBottom: 15 }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={product?.title ?? ""} />
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={["left", "right"]}>
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
          <View style={{ height: 225 - heightHeader }} />
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
      <Animated.View
        style={[
          styles.headerImageStyle,
          {
            opacity: headerImageOpacity,
            height: heightViewImg,
          },
        ]}
      >
        {renderSlider()}
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
                  source={like ? Images.favoriteSold : Images.favorite}
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
            onLike(!like);
          }}
        />
      </Animated.View>
    </View>
  );
}
