import React, {useState, useEffect} from 'react';
import { store } from "app/store";
// import GetLocation from 'react-native-get-location';
import * as Location from 'expo-location';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {BaseStyle, useTheme, BaseColor, Images} from '@config';
import {
  SafeAreaView,
  Icon,
  Text,
  Tag,
  Image,
  FoodListItem,
  RealEstateListItem,
  ModalFilter,
} from '@components';
import styles from './styles';
import {useSelector, useDispatch} from 'react-redux';
import {homeSelect, wishlistSelect, designSelect,userSelect} from '@selectors';
import {useTranslation} from 'react-i18next';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import Swiper from 'react-native-swiper';
import { useIsFocused } from "@react-navigation/native";
import {homeActions} from '@actions';
import OneSignal from 'react-native-onesignal';

export default function HomeFood({navigation}) {
  const getID = () => store.getState().auth?.user?.id;
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const {t} = useTranslation();
  const home = useSelector(homeSelect);
  const user = useSelector(userSelect);
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  
  const id = getID();

  //Prompt for push on iOS
  if(Platform.OS==='ios'){
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log("Prompt response:", response);
    });
  }

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
    let notification = notificationReceivedEvent.getNotification();
    console.log("notification: ", notification);
    const data = notification.additionalData
    console.log("additionalData: ", data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  });

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log("OneSignal: notification opened:", notification);
    const userid=getID();
    if(userid){
      navigation.navigate('NotificationsNew');
    }
  });
  console.log("user-id: ", id);
  if(id){
    OneSignal.sendTag('user_id',id.toString());
  }else{
    OneSignal.sendTag('user_id','nil');
  }
  const [countrys, setCountry] = useState(null);
  const [countrySelected, setCountrySelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location)
    })();

  },[])

  
  useEffect(() => { 
    if(!home?.sliders?.length){
      dispatch(
        homeActions.onLoad(design, () => {
          setRefreshing(false);
        },location?.coords),
      );
    } 
  },[isFocused,location]);

  useEffect(() => {
    if (home.countrys?.length > 0) {
      home.countrys[0].checked = true;
      setCountrySelected(home.countrys[0]);
      setCountry(home.countrys);
    }
  }, [home]);

  /**
   * on Refresh category
   */
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      homeActions.onLoad(design, () => {
        setRefreshing(false);
      },location?.coords),
    );
  };

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = (item,type) => {
    return wishlist.list?.some(i => { return i.item_id == item.id && type.toLowerCase() == i.type;});
  };

  /**
   * onSelect conntry
   */
  const onChangeCountry = () => {
    setCountrySelected(countrys?.find(item => item.checked));
    setModalVisible(false);
  };

  /**
   * onChange conntry
   */
  const onSelectCountry = selected => {
    setCountry(
      countrys?.map(item => {
        return {
          ...item,
          checked: item.value == selected.value,
        };
      }),
    );
  };

  /**
   *
   * onOpen ChooseBusiness
   */
  const onChooseBusiness = () => {
    navigation.navigate('ChooseBusiness');
  };

  /**
   *
   * onOpen Notification
   */
  const onNotification = () => {
    navigation.navigate('NotificationsNew');
  };

  /**
   * on navigate to List
   *
   */
  const onListView = (type = null) => {
    if(type=="Items"){
      navigation.navigate('ItemCategories', {type:type}); 
    }else{
      navigation.navigate('List', {type:type}); 
    }
  };

  /**
   * on navigate to Product detail
   *
   */
   const onProductDetail = (item,type) => {
    navigation.navigate('ProductDetail', {
      item: item,
      type:type.toLowerCase()
    });
  };

  const renderSlider = () => {
    if (home?.sliders?.length > 0) {
      return (
        <View style={styles.sliderContent}>
          <View style={styles.slider}>
            <Swiper
              dotStyle={{
                backgroundColor: colors.border,
                marginBottom: 8,
              }}
              activeDotStyle={{
                marginBottom: 8,
              }}
              paginationStyle={{bottom: 0}}
              loop={false}
              activeDotColor={colors.primary}
              removeClippedSubviews={false}>
              {home.sliders.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={{flex: 1}}
                    key={`banner${index}`}
                    activeOpacity={1}
                    //onPress={() => onProductDetail(item)}
                    >
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                      }}
                      source={{uri: item.image}}
                    />
                    <View style={styles.sliderTopLeft}>
                      {item.title && <Text headline semibold whiteColor>
                        {item.title}
                      </Text>}
                      {item.numberRate && 
                      <View style={styles.contentSliderRate}>
                        <View
                          style={[
                            styles.tagRate,
                            {backgroundColor: colors.primaryLight},
                          ]}>
                          <Icon
                            name="star"
                            size={10}
                            color={BaseColor.whiteColor}
                            solid
                          />
                          <Text
                            caption2
                            whiteColor
                            semibold
                            style={{marginLeft: 4}}>
                            {item.rate}
                          </Text>
                        </View>
                        <Text caption2 whiteColor semibold>
                          {item.numberRate} {t('reviews')}
                        </Text>
                      </View>
                      }
                    </View>
                  </TouchableOpacity>
                );
              })}
            </Swiper>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.sliderContent}>
        <Placeholder Animation={Progressive}>
          <PlaceholderMedia style={styles.slider} />
        </Placeholder>
      </View>
    );
  };
  /**
   * render list Location
   */
  const renderCategory = () => {
    let list = (
      <FlatList
        contentContainerStyle={{
          paddingLeft: 10,
          paddingRight: 20,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `Category ${index}`}
        renderItem={({item, index}) => {
          return (
            <View style={{paddingHorizontal: 10}}>
              <Placeholder Animation={Progressive}>
                <View
                  style={[
                    styles.categoryContent,
                    {backgroundColor: colors.card},
                  ]}>
                  <PlaceholderMedia style={styles.imageContent} />
                  <PlaceholderLine
                    style={{width: 50, height: 8, marginTop: 10}}
                  />
                </View>
              </Placeholder>
            </View>
          );
        }}
      />
    );
    if (home?.categories?.length > 0) {
      list = (
        <FlatList
          contentContainerStyle={{
            paddingLeft: 10,
            paddingRight: 20,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={home?.categories}
          keyExtractor={(item, index) => `Category ${index}`}
          renderItem={({item, index}) => {
            return (
              <View style={{paddingHorizontal: 10}}>
                <TouchableOpacity
                  style={[
                    styles.categoryContent,
                    {backgroundColor: colors.card},
                  ]}
                  onPress={() => onListView(item.title)}>
                  <Image style={styles.imageContent} source={{uri:item.image}} />
                  <Text
                    footnote
                    style={{
                      marginTop: 10,
                    }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      );
    }

    return (
      <View>
        <Text
          title3
          bold
          style={{marginTop: 20, paddingHorizontal: 20, marginBottom: 15}}>
          {t('explore_category')}
        </Text>
        {list}
      </View>
    );
  };

  /**
   * render list Feature
   */
   const renderRecommend = () => {
    let list = (
      <FlatList
        contentContainerStyle={{paddingLeft: 20}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `popular${index}`}
        renderItem={({item, index}) => (
          <RealEstateListItem
            loading={true}
            grid
            style={{
              marginRight: 15,
              width: 200,
            }}
          />
        )}
      />
    );

    if (home?.recommends?.length > 0) {
      list = (
        <FlatList 
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={home?.recommends}
          keyExtractor={(item, index) => `popular${index}`}
          renderItem={({item, index}) => (
            <RealEstateListItem
              grid
              title={item.title}
              subtitle={item.property_type}
              status={item.status}
              image={{uri:item.image}}
              price={item.price}
              favorite={isFavorite(item,'property')}
              style={{
                marginLeft: 15,
                width: 200,
              }}
              onPress={() => onProductDetail(item,'Property')}
            />
          )}
        />
      );
    }

    return (
      <View>
        <View style={{padding: 20}}>
          <Text title3 bold>
            {t('popular_nearly')}
          </Text>
          <Text body2 grayColor style={{marginTop: 4}}>
            {t('let_find_best_price')}
          </Text>
        </View>
        {list}
      </View>
    );
  };


  /**
   * render content banner
   * @returns
   */
  const renderBanner = () => {
    let banner = (
      <Placeholder Animation={Progressive}>
        <PlaceholderMedia style={styles.banner} />
      </Placeholder>
    );
    if (home.banner) {
      banner = (
        <View style={styles.banner}>
          <Image
            style={{width: '100%', height: '100%', borderRadius: 10}}
            source={home.banner.image}
          />
          <View style={styles.contentBannerTopLeft}>
            <Text headline semibold whiteColor>
              {home.banner.title}
            </Text>
            <Text footnote medium whiteColor style={{marginTop: 5}}>
              {t('let_find_best_promotion')}
            </Text>
          </View>
          <TouchableOpacity style={styles.bannerButton}>
            <Tag primary onPress={onListView}>
              {t('see_more')}
            </Tag>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{paddingHorizontal: 20, paddingTop: 20}}>{banner}</View>
    );
  };

  /**
   * render content new event
   * @returns
   */
  const renderRecentLocation = () => {
    let list = (
      <View style={{paddingHorizontal: 20}}>
        {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <FoodListItem
              key={`RecentLocation ${index}`}
              loading={true}
              list
              style={{marginBottom: 15}}
            />
          );
        })}
      </View>
    );
    if (home.items?.length > 0) {
      list = (
        <View style={{paddingHorizontal: 20}}>
          {home.items.map((item, index) => {
            return (
              <FoodListItem
                key={`RecentItems ${index}`}
                list
                title={item.title}
                subtitle={item.category_name}
                status={item.status}
                favorite={isFavorite(item,'item')}
                image={{uri:item.image}}
                address={item.location}
                style={{marginBottom: 15}}
                onPress={() => onProductDetail(item,'Item')}
              />
            );
          })}
        </View>
      );
    }

    return (
      <View>
        <View style={{padding: 20}}>
          <Text title3 bold>
            {t('recent_listing')}
          </Text>
          <Text
            body2
            grayColor
            style={{
              marginTop: 4,
            }}>
            {t('best_ever')}
          </Text>
        </View>
        {list}
      </View>
    );
  };

  /**
   * render content screen
   * @returns
   */
  const renderContent = () => {
    let countryView = <ActivityIndicator size="small" color={colors.primary} />;
    if (countrys?.length > 0) {
      countryView = (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <ModalFilter
            options={countrys}
            isVisible={modalVisible}
            onSwipeComplete={() => {
              setModalVisible(false);
            }}
            onApply={onChangeCountry}
            onSelectFilter={onSelectCountry}
          />
          <Icon name="map-marker-alt" size={18} color={colors.text} solid />
          <Text headline semibold style={{paddingHorizontal: 4}}>
            {countrySelected.text}
          </Text>
          <Icon
            name="chevron-down"
            size={12}
            color={colors.primaryLight}
            solid
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={{flex: 1}}>
        <View style={styles.contentHeader}>
          {/* {countryView} */}
          
          {/* <View style={{marginLeft:13}}><SvgCssUri uri={resolveAssetSource(Images.logo1).uri} style={styles.logo} width="140" height="40" resizeMode="contain" /></View> 
           */}
           <Image
            style={styles.logo}
            resizeMode="contain"
            source={Images.logo}
          />
          {user?.id && 
          <TouchableOpacity
            style={styles.notificationContent}
            onPress={() => onNotification()}
            >
            <Icon name="bell" size={18} color={BaseColor.grayColor} solid />
            <View
              style={[
                styles.doc,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.card,
                },
              ]}
            />
          </TouchableOpacity> }
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchHistory')}
          style={styles.contentSearch}>
          <View style={[BaseStyle.textInput, {backgroundColor: colors.card}]}>
            <Text body1 grayColor style={{flex: 1}}>
              {t('search_listing')}
            </Text>
            <View style={{paddingVertical: 8}}>
              <View
                style={[styles.lineForm, {backgroundColor: colors.border}]}
              />
            </View>
            <Icon
              name="location-arrow"
              size={18}
              color={colors.primaryLight}
              solid
            />
          </View>
        </TouchableOpacity>
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
          {renderSlider()}
          {renderCategory()}
          {renderRecommend()}
          {/* {renderBanner()} */}
          {renderRecentLocation()}
        </ScrollView>
        {user?.role?.name && user?.role?.name == 'Seller' ? 
        <TouchableOpacity
          onPress={onChooseBusiness}
          style={[styles.menuIcon, {backgroundColor: colors.primary}]}>
          <Icon name="plus" size={16} color={BaseColor.whiteColor} solid />
        </TouchableOpacity> : null }
      </View>
    );
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      {renderContent()}
    </SafeAreaView>
  );
}
