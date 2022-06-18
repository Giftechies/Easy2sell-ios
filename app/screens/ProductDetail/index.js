import React, { useRef, useState, useEffect } from "react";
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
  Clipboard
} from "react-native";
//import Clipboard from '@react-native-community/clipboard';
import { BaseColor, useTheme,Images, BaseStyle } from "@config";
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

import Swiper from "react-native-swiper";
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

  const scrollY = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(null);
  const [product, setProduct] = useState({});
  const [collapseHour, setCollapseHour] = useState(false);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(240, 1);

  
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
    // console.log(item+'test');
    // console.log(type);
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

  const onPressCopy = async () => {
    if(product.type=='coupon'){
      Clipboard.setString(product.code);
      if(product.referal_url!=''){
        onOpen('coupon', "Coupon Copied", product.referral_url);
      }else{
        Alert.alert({
          message: `Coupon Url not found`
        });
      }
    }else if(product.type=='deal'){
      if(product.referal_url!=''){
        onOpen('deal', "Deal Activated", product.referral_url);
      }else{
        Alert.alert({
          message: `Deal Url not found`
        });
      }
    }
  }

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
      message: `${t("do_you_want_open")} link ?`,
      action: [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("open"),
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
                case "deal":
                    Linking.openURL(link);
                break;
                case "coupon":
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

  const onPressMessenger = () => {
    //return false;
    if (user && product?.user && user.id!=product?.user?.id) {
      navigation.navigate({
        name: "Messages",
        params:{item,type,from_id:product?.user?.id}
      });
    }else if(user && product?.user && user.id==product?.user?.id){
      Alert.alert({
        message: `You can't send message on your listing`,
        action: [
          {
            text: t("Ok"),
            onPress: () => {
              
            },
          },
        ],
      });
    }else {
      navigation.navigate({
        name: "SignIn",
        params: {
          success: () => {
            navigation.navigate({
              name: "Messages",
              params:{item,type,from_id:product?.user?.id}
            });
          },
        },
      });
    }
  }

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
          <Icon name="heart" color={colors.li} size={18} />
        )}
      </TouchableOpacity>
    );
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

    if ( product?.gallery?.length) {
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
          {product.gallery?.map((item, index) => {
            return (
              <TouchableOpacity
                key={`banner${index}`}
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate("PreviewImage", {
                    gallery: product.gallery,
                  });
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{uri:item.image}}
                />
              </TouchableOpacity>
            );
          })}
        </Swiper>
        {product?.status ? <Tag style={{position:'absolute',right: 10,bottom: 10}} status>{product?.status}</Tag> : null}
        </Animated.View>
      );
    }
  };

  /**
   * render Content View
   * @returns
   */
  const renderContent = () => {
    if (loading) {
      return (
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
        <View style={{ height: 255 - heightHeader }} />
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          {product?.price || product?.location || product?.type ?
          <View style={[styles.lineSpace,{display:'flex',flexDirection:'row'}]}>
            {type=="job" && <Text headline semibold accentColor numberOfLines={1} style={{flex:1}}>
              {product?.location ?? product?.type}
            </Text>}
            {product && product?.price?<Text title3 semibold primaryColor>
              {product?.price}
            </Text>:null}
            
          </View>
          :null}
          <Text title2 semibold style={{ marginVertical: 1 }}>
            {product?.title}
          </Text>
          <View style={styles.lineSpace}>
            <View>
              <Text subhead grayColor numberOfLines={1}>
                {product?.property_type ?? product?.category_name ?? product?.start_date + ' - ' +product?.expiry_date}
              </Text>
            </View>
          </View>
          <ProfileCall
            image={product?.user?.image}
            title={product?.user?.name}
            subtitle={product?.user?.level}
            // phone={product?.user?.mobile}
            code={product?.code}
            showmessenger={true}
            onPressMessenger={() => onPressMessenger()}
            onPressCopy={() => onPressCopy()}
            // onPressPhone={() => onPressPhone(product.phone)}
            style={{ borderRadius:5,paddingVertical: 10,backgroundColor:BaseColor.lightGray,paddingHorizontal:10,marginVertical     :15 }}
          />
          {/* <View style={[styles.line, { backgroundColor: colors.border,height:1,marginBottom:10 }]} /> */}
          <Text style={{marginBottom:10,color:colors.primary}}>About</Text>
          {product?.available_for ? 
          <View
            style={styles.line}
            >
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="house-user" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t("available_for")}
              </Text>
              <Text footnote semibold>
                {Utils.camelCase(product?.available_for)}
              </Text>
            </View>
          </View>
          :null}
          {product?.bedrooms ? 
          <View
            style={styles.line}
            >
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="bed" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t("bedrooms")}
              </Text>
              <Text footnote semibold>
                {Utils.camelCase(product?.bedrooms)}
              </Text>
            </View>
          </View>
          :null}
          {product?.bathrooms ? 
          <View
            style={styles.line}
            >
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="bath" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t("bathrooms")}
              </Text>
              <Text footnote semibold>
                {Utils.camelCase(product?.bathrooms)}
              </Text>
            </View>
          </View>
          :null}
          {product?.builtup_area ? 
          <View
            style={styles.line}
            >
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="chart-area" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t("builtup_area")}
              </Text>
              <Text footnote semibold>
                {Utils.camelCase(product?.builtup_area)}
              </Text>
            </View>
          </View>
          :null}
          {product?.carpet_area ? 
          <View
            style={styles.line}
            >
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="chart-area" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t("carpet_area")}
              </Text>
              <Text footnote semibold>
                {product?.carpet_area}
              </Text>
            </View>
          </View>
          :null}
          {product?.salary_type ?
          <View
            style={styles.line}
            >
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="money-bill-alt" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t("salary_type")}
              </Text>
              <Text footnote semibold>
                {product?.salary_type}
              </Text>
            </View>
          </View>
          :null}
          
          {product?.job_type ? 
          <View
            style={styles.line}
            >
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="business-time" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t("job_type")}
              </Text>
              <Text footnote semibold>
                {product?.job_type}
              </Text>
            </View>
          </View>
          :null}
          {product?.qty ? 
          <View
            style={styles.line}
            >
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}
            >
              <Icon name="asterisk" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t("qty")}
              </Text>
              <Text footnote semibold>
                {product?.qty}
              </Text>
            </View>
          </View>
          :null}
          
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
              <Text footnote semibold>
                {product?.location}
              </Text>
            </View>
          </TouchableOpacity>}
          {/* {product?.user?.mobile && <TouchableOpacity
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
              <Text footnote semibold>
                {product?.user?.mobile}
              </Text>
            </View>
          </TouchableOpacity>} */}
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
              <Text footnote semibold>
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
              <Text footnote semibold>
                {product?.user?.website}
              </Text>
            </View>
          </TouchableOpacity>}
        </View>
        <View
          style={[styles.contentDescription, { borderColor: colors.border }]}
        >
        {product?.description ? <Text style={{marginBottom:10,color:colors.primary}}>Description</Text>: null}
          <Text body2 style={{ lineHeight: 20,textAlign: 'justify' }} numberOfLines={null}>
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
              <Text headline>
                {product?.dateEstablish}
              </Text>
            </View>
            
          </View>
          {type!='coupon'?<View
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
          </View>:null}
        </View>
        {product?.home_amenities?.length>0 && <>
        <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingBottom: 5,
            paddingTop: 15,
          }}
        >
          {t("amenities")}
        </Text>
        <View style={[styles.wrapContent, { borderColor: colors.border }]}>
          {product?.home_amenities?.map?.((item) => {
            return (
              <Tag
                key={item.id.toString()}
                // icon={
                //   <Icon
                //     name={Utils.iconConvert(item.icon)}
                //     size={12}
                //     color={colors.accent}
                //     solid
                //     style={{ marginRight: 5 }}
                //   />
                // }
                chip
                style={{
                  marginTop: 8,
                  marginRight: 8,
                }}
              >
                {item.name}
              </Tag>
            );
          })}
        </View>
        </>}
        
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
        {product?.related &&<FlatList
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
                favorite={isFavorite(item,'vehicle')}
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
                rate={item.rate}
                status={item.price}
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
                favorite={isFavorite(item,'property')}
                onPress={() => onProductDetail(item,'property')}
                onPressTag={() => onReview(item)}
                style={{
                  marginLeft: 15,
                  width: Dimensions.get("window").width / 2,
                }}
            /> :  type == 'construction' ? <RealEstateListItem
                grid
                title={item.title}
                subtitle={item.category_name}
                status={item.status}
                image={{uri:item.image}}
                address={item.location}
                favorite={isFavorite(item,'construction')}
                onPress={() => onProductDetail(item,'construction')}
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
                favorite={isFavorite(item,'coupon')}
                onPress={() => onProductDetail(item,'coupon')}
                style={{
                  marginLeft: 15,
                  width: Dimensions.get("window").width / 2,
                }}
                onPressTag={() => onReview(item)}
          />:''
          )}
        /> }
        </>:null}
        
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
      
      <Header title={product?.title ?? ""} />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={["right", "left"]}>
        {renderContent()}
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
          renderRight={() => {
            return (
              <View style={styles.iconContent}>
                {renderLike()}
              </View>
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={() => {
            onLike(!like);
          }}
        />
      </Animated.View>
    </View>
  );
}
