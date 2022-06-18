import {
  Header,
  Image,
  SafeAreaView,
  Text,
  Tag,
  StarRating,
  ProfileCall,
  Icon,
  RealEstateListItem,
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
  const item = route.params?.item;
  const dispatch = useDispatch();
  const user = useSelector(userSelect);
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const { colors } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

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
   * go product detail
   * @param {*} item
   */
  const onProductDetail = (item) => {
    navigation.replace("ProductDetail", { item: item });
  };

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = (item) => {
    return wishlist.list?.some((i) => i.id == item.id);
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
   * on Call
   */
  const onPressPhone = (phone) => {
    Alert.alert({
      title: t("phone"),
      message: `${t("do_you_want_open")} ${t("phone")} ?`,
      action: [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("done"),
          onPress: () => {
            Linking.openURL("tel://" + phone);
          },
        },
      ],
    });
  };

  /**
   * render  Slider
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
        {product.gallerys?.map((item, index) => {
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
    );
  };

  /**
   * render Content UI
   * @return {*}
   */
  const renderContent = () => {
    if (loading) {
      return (
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
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

    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <View style={styles.lineSpace}>
          <Text headline semibold accentColor>
            {product.subtitle}
          </Text>
          <Text title3 semibold primaryColor>
            {product.price}
          </Text>
        </View>
        <Text title1 semibold style={{ marginVertical: 10 }} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.lineSpace}>
          <View>
            <Text subhead grayColor numberOfLines={1}>
              {product.address}
            </Text>
            <TouchableOpacity onPress={onReview} style={styles.lineRate}>
              <Tag rateSmall style={{ marginRight: 5 }}>
                {product.rate}
              </Tag>
              <StarRating
                disabled={true}
                starSize={10}
                maxStars={5}
                rating={product.rate}
                fullStarColor={BaseColor.yellowColor}
              />
              <Text footnote grayColor style={{ marginLeft: 4 }}>
                ({product.numberRate})
              </Text>
            </TouchableOpacity>
          </View>
          {product.status ? <Tag status>{product.status}</Tag> : null}
        </View>
        <ProfileCall
          image={product.author?.image}
          title={product.author?.name}
          subtitle={product.author?.level}
          onPressMessenger={() => onPressMessenger()}
          onPressPhone={() => onPressPhone(product.phone)}
          style={{ paddingVertical: 20 }}
        />
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text
          headline
          semibold
          style={{
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {t("facilities")}
        </Text>
        <View style={styles.wrapContent}>
          {product.facilities?.map?.((item, index) => {
            return (
              <View style={styles.tagContent} key={`facilities ${index}`}>
                <View
                  style={[styles.tagIcon, { backgroundColor: colors.card }]}
                >
                  <Icon name={item.icon} size={14} color={colors.accent} />
                </View>
                <Text overline accentColor style={{ marginHorizontal: 4 }}>
                  {item.title}
                </Text>
              </View>
            );
          })}
        </View>
        <Text
          headline
          semibold
          style={{
            marginTop: 20,
            marginBottom: 10,
          }}
        >
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
          {t("nearly_location")}
        </Text>
        <Text body2 grayColor>
          {t("let_find_more_location")}
        </Text>
        <View style={{ paddingVertical: 10 }}>
          {product.nearlys?.map((item, index) => {
            return (
              <RealEstateListItem
                key={`nearlys ${index}`}
                card
                title={item.title}
                subtitle={item.subtitle}
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
