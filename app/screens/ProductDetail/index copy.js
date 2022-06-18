import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { BaseColor, useTheme, BaseStyle } from "@config";
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  ProfileCall,
  StarRating,
  Tag,
  Image,
  ListItem,
  FoodListItem,
  EventListItem,
  CouponListItem,
  RealEstateListItem,
} from "@components";
import { useTranslation } from "react-i18next";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Utils from "@utils";
import { useDispatch, useSelector } from "react-redux";
import * as api from '@api';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from "rn-placeholder";
import { productActions, wishListActions } from "@actions";
import * as actionTypes from "@actions/actionTypes";
import { userSelect, wishlistSelect, designSelect } from "@selectors";
import styles from "./styles";

export default function ProductDetail({ navigation, route }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const item = route.params?.item;
  const type = route.params?.type??'';
  const user = useSelector(userSelect);
  const deltaY = new Animated.Value(0);

  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(null);
  const [product, setProduct] = useState({});
  const [collapseHour, setCollapseHour] = useState(false);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(240, 1);

  useEffect(() => {
    dispatch(
      productActions.onLoadProduct(item.id, design,type, (item) => {
        setLoading(false);
        setProduct(item);
        setLike(isFavorite(item,type));
        isFavorite(item,type);
      })
    );
  }, [design, dispatch, item.id, type]);

  

  /**
   * check wishlist state
   * only UI kit
   */
   const isFavorite = (item,type) => {
    // console.log(type + '=' +item.id);
    // console.log(wishlist.list?.some(i => { console.log(type + '=' +i.item_id+ ' = ' +item.id); return (i.item_id == item.id && type.toLowerCase() == i.type);}));
    return wishlist.list?.some(i => { return (i.item_id == item.id && type.toLowerCase() == i.type);});
  };

  /**
   * item action
   * @param {*} item
   */
  const onLike = async (like) => {
    if (user) {
      let params = {
        item_id:item.id,
        type:type.toLowerCase()
      }
      const response = await api.addRemoveWish(params);
      if(response.success){
        setLike(null);
        setLike(like);
        dispatch({ type: actionTypes.GET_WISHLIST });
      }
    } else {
      navigation.navigate({
        name: "SignIn",
        // params: {
        //   success: () => {
        //     dispatch(wishListActions.onUpdate(item));
        //     setLike(like);
        //   },
        // },
      });
    }
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
   * go product detail
   * @param {*} item
   */
  const onProductDetail = (item) => {
    navigation.replace("ProductDetail", { item: item, type:type });
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
   * collapse open time
   */
  const onCollapse = () => {
    Utils.enableExperimental();
    setCollapseHour(!collapseHour);
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
   * render Banner
   * @returns
   */
  const renderBanner = () => {
    // console.log(product);
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <Animated.View
            style={[
              styles.imgBanner,
              {
                height: deltaY.interpolate({
                  inputRange: [
                    0,
                    Utils.scaleWithPixel(140),
                    Utils.scaleWithPixel(140),
                  ],
                  outputRange: [heightImageBanner, heightHeader, heightHeader],
                }),
              },
            ]}
          >
            <PlaceholderMedia style={{ width: "100%", height: "100%" }} />
          </Animated.View>
        </Placeholder>
      );
    }

    return (
      <Animated.View
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              // outputRange: [heightImageBanner, heightHeader, heightHeader],
              
              outputRange: [heightImageBanner, 70, 70],
            }),
          },
        ]}
      >
        <Image
          source={{uri:product?.image}}
          style={{ width: "100%", height: "100%" }}
        />
        <Animated.View
          style={{
            position: "absolute",
            bottom: 15,
            left: 20,
            flexDirection: "row",
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}
        >
          {/* <Image source={product?.author?.image} style={styles.userIcon} />
          <View>
            <Text headline semibold whiteColor>
              {product?.author?.name}
            </Text>
            <Text footnote whiteColor>
              {product?.author?.email}
            </Text>
          </View> */}
        </Animated.View>
      </Animated.View>
    );
  };

  /**
   * render Content View
   * @returns
   */
  const renderContent = () => {
    if (loading) {
      return (
        <ScrollView
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: deltaY },
                },
              },
            ],
            { useNativeDriver: false }
          )}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}
        >
          <View style={{ height: 255 - heightHeader }} />
          <Placeholder Animation={Progressive}>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
            >
              <PlaceholderLine style={{ width: "50%", marginTop: 10 }} />
              <PlaceholderLine style={{ width: "70%" }} />
              <PlaceholderLine style={{ width: "40%" }} />
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: "40%" }} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: "40%" }} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: "40%" }} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: "40%" }} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: "40%" }} />
                </View>
              </View>
              <PlaceholderLine
                style={{ width: "100%", height: 250, marginTop: 20 }}
              />
            </View>
          </Placeholder>
        </ScrollView>
      );
    }
    return (
      <ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: deltaY },
              },
            },
          ],
          { useNativeDriver: false }
        )}
        onContentSizeChange={() => {
          setHeightHeader(Utils.heightHeader());
        }}
        scrollEventThrottle={8}
      >
        <View style={{ height: 255 - heightHeader }} />
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <View style={styles.lineSpace}>
            <Text headline semibold accentColor>
              {product?.location ?? product?.type}
            </Text>
            <Text title3 semibold primaryColor>
              {product?.price}
            </Text>
          </View>
          <Text title1 semibold style={{ marginVertical: 10 }} numberOfLines={1}>
            {product?.title}
          </Text>
          <View style={styles.lineSpace}>
            <View>
              <Text subhead grayColor numberOfLines={1}>
                {product?.property_type ?? product?.category_name ?? product?.start_date + ' - ' +product?.expiry_date}
              </Text>
            </View>
            {product?.status ? <Tag status>{product?.status}</Tag> : null}
          </View>
          <ProfileCall
            image={product?.user?.image}
            title={product?.user?.name}
            subtitle={product?.user?.level}
            phone={product?.user?.mobile}
            onPressMessenger={() => onPressMessenger()}
            // onPressPhone={() => onPressPhone(product.phone)}
            style={{ paddingVertical: 20 }}
          />
          {product?.location && <TouchableOpacity
            style={styles.line}
            onPress={() => {
              const location = `${product?.geo?.latitude},${product?.geo?.longitude}`;
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
                {product?.location}
              </Text>
            </View>
          </TouchableOpacity>}
          {product?.user?.mobile && <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen("phone", t("tel"), product?.user?.mobile);
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
                {product?.user?.mobile}
              </Text>
            </View>
          </TouchableOpacity>}
          {product?.user?.email && 
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen("envelope", t("envelope"), product?.user?.email);
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
                {product?.user?.email}
              </Text>
            </View>
          </TouchableOpacity>}
          {product?.user?.website && 
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen("web", t("website"), product?.user?.website);
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
                {product?.user?.website}
              </Text>
            </View>
          </TouchableOpacity>}
          {/* <TouchableOpacity style={styles.line} onPress={onCollapse}>
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="clock" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={styles.contentInforAction}>
              <View>
                <Text caption2 grayColor>
                  {t("open_hour")}
                </Text>
              </View>
              <Icon
                name={collapseHour ? "angle-up" : "angle-down"}
                size={24}
                color={BaseColor.grayColor}
              />
            </View>
          </TouchableOpacity> */}
          {/* <View
            style={{
              paddingLeft: 40,
              paddingRight: 20,
              marginTop: 5,
              height: collapseHour ? 0 : null,
              overflow: "hidden",
            }}
          >
            {product?.openTime?.map?.((item) => {
              return (
                <View
                  style={[styles.lineWorkHours, { borderColor: colors.border }]}
                  key={item.label}
                >
                  <Text body2 grayColor>
                    {t(item.label)}
                  </Text>
                  <Text body2 accentColor semibold>
                    {`${item.start} - ${item.end}`}
                  </Text>
                </View>
              );
            })}
          </View> */}
        </View>
        <View
          style={[styles.contentDescription, { borderColor: colors.border }]}
        >
          <Text body2 style={{ lineHeight: 20 }}>
            {product?.description}
          </Text>
          <View
            style={{
              paddingVertical: 20,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text caption1 grayColor>
                {t("post_date")}
              </Text>
              <Text headline style={{ marginTop: 5 }}>
                {product?.dateEstablish}
              </Text>
            </View>
            {/* <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text caption1 grayColor>
                {t("price_range")}
              </Text>
              <Text headline style={{ marginTop: 5 }}>
                {`${product?.priceMin ?? "-"}$ - ${product?.priceMax ?? "-"}$`}
              </Text>
            </View> */}
          </View>
          <View
            style={{
              height: 180,
              paddingVertical: 20,
            }}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: parseFloat(product?.geo?.latitude ?? 0.0),
                longitude: parseFloat(product?.geo?.longitude ?? 0.0),
                latitudeDelta: 0.009,
                longitudeDelta: 0.004,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(product?.geo?.latitude ?? 0.0),
                  longitude: parseFloat(product?.geo?.longitude ?? 0.0),
                }}
              />
            </MapView>
          </View>
        </View>
        <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingBottom: 5,
            paddingTop: 15,
          }}
        >
          {t("facilities")}
        </Text>
        <View style={[styles.wrapContent, { borderColor: colors.border }]}>
          {product?.features?.map?.((item) => {
            return (
              <Tag
                key={item.id.toString()}
                icon={
                  <Icon
                    name={Utils.iconConvert(item.icon)}
                    size={12}
                    color={colors.accent}
                    solid
                    style={{ marginRight: 5 }}
                  />
                }
                chip
                style={{
                  marginTop: 8,
                  marginRight: 8,
                }}
              >
                {item.title}
              </Tag>
            );
          })}
        </View>
        {product?.related?.length ? <><Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          {t("related")}
        </Text>
        <FlatList
          contentContainerStyle={{ paddingLeft: 5, paddingRight: 20, paddingBottom:20 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={product?.related ?? []}
          keyExtractor={(item, index) => `featured ${index}`}
          renderItem={({ item, index }) => (
            type == 'vehicle' ? <FoodListItem
            grid
                  title={item.title}
                  subtitle={item.category_name}
                  status={item.price}
                  image={{uri:item.image}}
                  address={item.location}
                  numReviews={item.numberRate}
                  favorite={isFavorite(item),'vehicle'}
                  onPress={() => onProductDetail(item,'vehicle')}
                  onPressTag={() => onReview(item)}
                  style={{
                    marginLeft: 15,
                    width: Dimensions.get("window").width / 2,
                  }}
              /> : type == 'item' ? <ListItem
              grid
                  image={{uri:item.image}}
                  title={item.title}
                  subtitle={item.category_name}
                  location={item.location}
                  //phone={item.phone}
                  rate={item.rate}
                  status={item.price}
                  //numReviews={item.rate}
                  favorite={isFavorite(item,'item')}
                  onPress={() => onProductDetail(item,'item')}
                  onPressTag={() => onReview(item)}
                  style={{
                    marginLeft: 15,
                    width: Dimensions.get("window").width / 2,
                  }}
              />  : type == 'job' ? <ListItem
              grid
                  title={item.title}
                  subtitle={item.business_name}
                  status={item.status}
                  image={{uri:item.image}}
                  address={item.location}
                  phone={item.salary_type}
                  numReviews={item.job_type}
                  favorite={isFavorite(item,'job')}
                  onPress={() => onProductDetail(item,'job')}
                  onPressTag={() => onReview(item)}
                  style={{
                    marginLeft: 15,
                    width: Dimensions.get("window").width / 2,
                  }}
              /> : type == 'property' ? <RealEstateListItem
              grid
                  title={item.title}
                  subtitle={item.property_type}
                  status={item.available_for}
                  image={{uri:item.image}}
                  address={item.location}
                  //phone={item.phone}
                  //numReviews={item.carpet_area}
                  favorite={isFavorite(item,'property')}
                  onPress={() => onProductDetail(item,'property')}
                  onPressTag={() => onReview(item)}
                  style={{
                    marginLeft: 15,
                    width: Dimensions.get("window").width / 2,
                  }}
              /> : type == 'coupon' ? <EventListItem
              grid
                  title={item.title}
                  subtitle={item.code}
                  status={item.status}
                  image={{uri:item.image}}
                  //address={item.location}
                  //phone={item.code}
                  //numReviews={item.code}
                  favorite={isFavorite(item,'coupon')}
                  onPress={() => onProductDetail(item,'coupon')}
                  style={{
                    marginLeft: 15,
                    width: Dimensions.get("window").width / 2,
                  }}
                  onPressTag={() => onReview(item)}
          />:''
          )}
        /></>:null}
        
        {/* <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          {t("latest")}
        </Text>
        <View style={{ paddingHorizontal: 20 }}>
          {product?.lastest?.map?.((item) => {
            return (
              <ListItem
                key={item.id.toString()}
                small
                image={item.image?.full}
                title={item.title}
                subtitle={item.category?.title}
                rate={item.rate}
                style={{ marginBottom: 15 }}
                onPress={() => onProductDetail(item)}
                onPressTag={onReview}
              />
            );
          })}
        </View> */}
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderBanner()}
      <Header
      style={{backgroundColor: 'rgba(52, 52, 52, 0.5)'}}
        title=""
        renderLeft={() => {
          return (
            <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
          );
        }}
        renderRight={() => {
          let gallery = product?.gallery;
          return (gallery ? <Icon name="images" size={20} color={BaseColor.whiteColor} /> : null);
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate("PreviewImage", {
            gallery: product?.gallery,
          });
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={["right", "left"]}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
