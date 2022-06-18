import React, {useState, useRef, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated, Alert,TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BaseStyle, BaseColor, useTheme} from '@config';
import Carousel from 'react-native-snap-carousel';
import * as actionTypes from "@actions/actionTypes";
import { SettingModel } from "@models";
import * as api from '@api';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  Header,
  SafeAreaView,
  Icon,
  ListItem,
  FilterSort, 
  FoodListItem,
  EventListItem,
  CouponListItem,
  RealEstateListItem,
  Tag,
  Text,
} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  listSelect,
  settingSelect,
  userSelect,
  wishlistSelect,
  designSelect,
} from '@selectors';
import {listActions} from '@actions';

export default function List({navigation, route}) {
  const [page, setPage] = useState(1);
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wishlistSelect);
  const list = useSelector(listSelect);
  const design = useSelector(designSelect);
  const setting = useSelector(settingSelect);
  const user = useSelector(userSelect);

  const { type } = route?.params??{};
  const [lists, setLists] = useState([]);
  const [viewtype, setViewtype] = useState('');
  const [locationData, setLocationData] = useState({});

  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );

  const sliderRef = useRef(null);
  const [filter, setFilter] = useState(route.params?.filter ?? {});
  const [active, setActive] = useState(0);
  const [viewportWidth] = useState(Utils.getWidthDevice());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modeView, setModeView] = useState(setting.mode);
  const [mainSelectedCategory, setMainSelectedCategory] = useState(route.params?.mainCategory ?? null);
  const [mainCategories, setMainCategories] = useState([]);
  const [mapView, setMapView] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [region, setRegion] = useState({
    latitude: 0.0,
    longitude: 0.0,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });

  // useEffect(() => {
  //   dispatch(
  //     listActions.onLoadList(route.params?.filter, design, () => {
  //       setLoading(false);
  //       setRefreshing(false);
  //     }),
  //   );
  // }, [design, dispatch, route.params?.filter]);

  useEffect(() => {  
    filter.latitude=locationData?.geometry?.location?.lat ?? null;
    filter.longitude=locationData?.geometry?.location?.lng ?? null;
    const params = {
      type: type,
      page: 1,
      main_category:mainSelectedCategory,
      orderBy: filter.sort ? filter.sort : "",
      filter: filter
    };
    getList(params);
  },[type,mainSelectedCategory,locationData]);


  const renderLocationSelect = () => {
    return (
      <View style={styles.autocomplete}>
        <GooglePlacesAutocomplete
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          fetchDetails={true}
          placeholder="Search"
          query={{
            key: "AIzaSyCnZAFX7HA9pil0wpoZRVWm7f4vigQJKgw",
            language: 'en',
            components:'country:ca'
          }}
          onPress={(data, details = null) => locationChanged(data,details)}
          onFail={(error) => console.error(error)}
          requestUrl={{
            url:
              'https://maps.googleapis.com/maps/api',
            useOnPlatform: 'web',
          }} // this in only required for use on the web. See https://git.io/JflFv more for details.
          
					renderRightButton={() => (
						<TouchableOpacity
              style={{paddingHorizontal:15,paddingVertical:14,borderRadius:10,marginLeft:5,backgroundColor:'#eaeaea'}}
              onPress={() => { locationReset() }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                
                {/* <Icon
                  name="times"
                  size={15}
                /> */}
                <Text>Reset</Text>
              </View>
            </TouchableOpacity>
					)}
        />
        
      </View>
    );
  };

  const locationReset = (data,details) => {
    setLocationData({}); setViewtype('');
  };

  const locationChanged = (data,details) => {
    setViewtype('');
    data.geometry=details?.geometry; setLocationData(data);
  }
  
  /**
   * on refresh list
   *
   */
  const onRefresh = () => {
    setRefreshing(true);
    const params = {
      page: 1,
      type: type,
      main_category:mainSelectedCategory,
      orderBy: filter.sort ? filter.sort : "",
      // filter: filter
    };
    //console.log(params);
    getList(params);
  };

  /**
   * export viewport
   * @param {*} percentage
   * @returns
   */
  const getViewPort = percentage => {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  };

  /**
   * call when on change sort
   */
  const onChangeSort = sort => {
    if (sort) {
      //console.log(sort);
      filter.latitude=locationData?.geometry?.location?.lat ?? null;
      filter.longitude=locationData?.geometry?.location?.lng ?? null;
      filter.sort = sort;
      setFilter(filter);
      const params = {
          page: 1,
          type: type,
          orderBy: filter?.sort ?? null,
          main_category: mainSelectedCategory?mainSelectedCategory : null,
          filter: filter
        };
      getList(params);
      //console.log(params);
    }
  };

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onFilter = () => {
    filter.latitude=locationData?.geometry?.location?.lat ?? null;
    filter.longitude=locationData?.geometry?.location?.lng ?? null;
    navigation.navigate('Filter', {
      filter,
      itemType:type,
      onApply: filter => {
        setFilter(filter);
        const params = {
          page: 1,
          type: type,
          orderBy: filter?.sort ?? null,
          main_category: mainSelectedCategory?mainSelectedCategory : null,
          filter: filter
        };
        getList(params);
      },
    });
  };

  /**
   * on refresh list
   *
   */
   const loadMore = () => {
      setRefreshing(true);
      const params = {
        page: page,
        type: type,
        orderBy: filter?.sort ?? null,
        main_category: mainSelectedCategory?mainSelectedCategory : null,
        filter: filter
      };
      getList(params);
  };

  const getList = async(params) => {
    if(!sendingRequest){
      setSendingRequest(true);
    
      try {
        const response = await api.getListing(params);
        if(response.success){
          setLoading(false);
          setRefreshing(false);

          if(response?.meta && response?.meta?.current_page==1){
            //console.log('here');
            setLists(response?.data);
          }else{
            //console.log('there');
            setLists([...lists, ...response?.data]);
          }

          setPage(response?.meta?.current_page+1);

          if(response.filter){
            const setting = new SettingModel(response.filter);
            dispatch({ type: actionTypes.SAVE_SETTING, setting});
          }

        }
      } catch (error) {
        let msg=error.data ?? error.code ?? error.message ?? error.msg;
        if(msg){
          Alert.alert({
              message: msg,
          });
        }
        //console.log("error");
      }

      setSendingRequest(false);
    }
    
    setLoading(false);
    setRefreshing(false);
  }

  /**
   * @description Called when filtering option > category
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */
  const onSelectMainCategory = select => {
      setMainSelectedCategory(select);
      setMainCategories([]);
  };


  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');
        break;
      case 'grid':
        setModeView('list');
        break;
      case 'list':
        setModeView('block');
        break;
      default:
        setModeView('block');
        break;
    }
  };

  /**
   * onChange view style
   *
   */
  const onChangeMapView = () => {
    Utils.enableExperimental();
    if (!mapView) {
      setRegion({
        latitude: list?.data?.[0]?.geo?.latitude,
        longitude: list?.data?.[0]?.geo?.longitude,
        latitudeDelta: 0.009,
        longitudeDelta: 0.004,
      });
    }
    setMapView(!mapView);
  };

  /**
   * on Select location map view
   * @param {*} location
   * @returns
   */
  const onSelectLocation = location => {
    for (let index = 0; index < list?.data?.length; index++) {
      const element = list?.data[index];
      if (
        element.location.latitude == location.latitude &&
        element.location.longitude == location.longitude
      ) {
        sliderRef.current.snapToItem(index);
        return;
      }
    }
  };

  /**
   * on Review action
   */
  const onProductDetail = (item,type) => {
    navigation.navigate('ProductDetail', {
      item: item,
      type:type.toLowerCase()
    });
  };

  /**
   * on Review action
   */
  const onReview = item => {
    if (user) {
      navigation.navigate('Review');
    } else {
      navigation.navigate({
        name: 'SignIn',
        params: {
          success: () => {
            navigation.navigate('Review');
          },
        },
      });
    }
  };

  /**
   * check wishlist state
   * UI kit
   */
   const isFavorite = (item,type) => {
    return wishlist.list?.some(i => { return (i.item_id == item.id && type.toLowerCase() == i.type);});
  };


  /**
   * @description Render loading view
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @returns
   */
  const renderLoading = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={[1, 2, 3, 4, 5, 6, 7, 8]}
              key={'block'}
              keyExtractor={(item, index) => `block${index}`}
              renderItem={({item, index}) => <ListItem block loading={true} />}
          onEndReached={()=>loadMore()}
          onEndThreshold={0.7}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                sortSelected={filter?.sort}
                modeView={modeView}
                sortOption={setting?.sortOption}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onChangeLocationView={()=>setViewtype('map')}
                onFilter={onFilter}
                type={type}
              />
            </Animated.View>
          </View>
        );
      case 'grid':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={[1, 2, 3, 4, 5, 6, 7, 8]}
              key={'gird'}
              keyExtractor={(item, index) => `gird ${index}`}
              renderItem={({item, index}) => (
                <ListItem
                  grid
                  loading={true}
                  style={{
                    marginLeft: 15,
                    marginBottom: 15,
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                sortSelected={filter?.sort}
                modeView={modeView}
                sortOption={setting?.sortOption}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onChangeLocationView={()=>setViewtype('map')}
                onFilter={onFilter}
                type={type}
              />
            </Animated.View>
          </View>
        );

      case 'list':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingHorizontal: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={[1, 2, 3, 4, 5, 6, 7, 8]}
              key={'list'}
              keyExtractor={(item, index) => `list ${index}`}
              renderItem={({item, index}) => (
                <ListItem
                  list
                  loading={true}
                  style={{
                    marginBottom: 15,
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                sortSelected={filter?.sort}
                modeView={modeView}
                sortOption={setting?.sortOption}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onChangeLocationView={()=>setViewtype('map')}
                onFilter={onFilter}
                type={type}
              />
            </Animated.View>
          </View>
        );
      default:
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={[1, 2, 3, 4, 5, 6, 7, 8]}
              key={'block'}
              keyExtractor={(item, index) => `block${index}`}
              renderItem={({item, index}) => <ListItem block loading={true} />}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                sortSelected={filter?.sort}
                modeView={modeView}
                sortOption={setting?.sortOption}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onChangeLocationView={()=>setViewtype('map')}
                onFilter={onFilter}
                type={type}
              />
            </Animated.View>
          </View>
        );
    }
  };

  /**
   * @description Render container view
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @returns
   */

  const renderList = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    //console.log(modeView);
    switch (modeView) {
      case 'block':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={lists}
              key={'block'}
              keyExtractor={(item, index) => `block ${index}`}
              onEndReached={()=>loadMore()}
              onEndThreshold={0.7}
              renderItem={({item, index}) => (
              type == 'Vehicles' ? <FoodListItem
              block
                  title={item.title}
                  subtitle={item.category_name}
                  status={item.price}
                  image={{uri:item.image}}
                  address={item.location}
                  numReviews={item.numberRate}
                  favorite={isFavorite(item,'vehicle')}
                  onPress={() => onProductDetail(item,'vehicle')}
                  onPressTag={() => onReview(item)}
              /> : type == 'Items' ? <ListItem
              block
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
              />  : type == 'Jobs' ? <ListItem
              block
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
              /> : type == 'Properties' ? <RealEstateListItem
              block
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
              /> :  type == 'Construction' ? <RealEstateListItem
              block
                  title={item.title}
                  subtitle={item.category_name}
                  status={item.status}
                  image={{uri:item.image}}
                  address={item.location}
                  favorite={isFavorite(item,'construction')}
                  onPress={() => onProductDetail(item,'construction')}
                  onPressTag={() => onReview(item)}
              /> : type == 'Coupons' ? <EventListItem
              block
                  title={item.title}
                  subtitle={item.code}
                  status={item.status}
                  image={{uri:item.image}}
                  //address={item.location}
                  //phone={item.code}
                  //numReviews={item.code}
                  favorite={isFavorite(item,'coupon')}
                  onPress={() => onProductDetail(item,'coupon')}
                  onPressTag={() => onReview(item)}
          /> : ''
            )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                sortSelected={filter?.sort}
                modeView={modeView}
                sortOption={setting?.sortOption}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onChangeLocationView={()=>setViewtype('map')}
                onFilter={onFilter}
                type={type}
              />
            </Animated.View>
          </View>
        );
      case 'grid':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={lists}
              key={'gird'}
              keyExtractor={(item, index) => `gird ${index}`}
              onEndReached={()=>loadMore()}
              onEndThreshold={0.7}
              renderItem={({item, index}) => (
                type == 'Vehicles' ? <FoodListItem
                      grid
                      title={item.title}
                      subtitle={item.category_name}
                      status={item.price}
                      image={{uri:item.image}}
                      address={item.location}
                      distance={item.category_name}
                      //promotion={item.price}
                      style={{
                        marginLeft: 15,
                        marginBottom: 15,
                      }}
                      favorite={isFavorite(item,'vehicle')}
                      onPress={() => onProductDetail(item,'vehicle')}
                      onPressTag={() => onReview(item)}
                  /> : type == 'Items' ? <ListItem
                      grid
                      image={{uri:item.image}}
                      title={item.title}
                      subtitle={item.category_name}
                      location={item.location}
                      //phone={item.phone}
                      rate={item.rate}
                      status={item.price}
                      //numReviews={item.rate}
                      style={{
                        marginLeft: 15,
                        marginBottom: 15,
                      }}
                      favorite={isFavorite(item,'item')}
                      onPress={() => onProductDetail(item,'item')}
                      onPressTag={() => onReview(item)}
                  />  : type == 'Jobs' ? <ListItem
                      grid
                      title={item.title}
                      subtitle={item.business_name}
                      status={item.status}
                      image={{uri:item.image}}
                      address={item.location}
                      phone={item.salary_type}
                      numReviews={item.job_type}
                      style={{
                        marginLeft: 15,
                        marginBottom: 15,
                      }}
                      favorite={isFavorite(item,'job')}
                      onPress={() => onProductDetail(item,'job')}
                      onPressTag={() => onReview(item)}
                  /> : type == 'Properties' ? <RealEstateListItem
                      grid
                      title={item.title}
                      subtitle={item.property_type}
                      status={item.available_for}
                      image={{uri:item.image}}
                      address={item.location}
                      price={item.location}
                      favorite={isFavorite(item,'property')}
                      style={{
                        marginLeft: 15,
                        marginBottom: 15,
                      }}
                      onPress={() => onProductDetail(item,'property')}
                      onPressTag={() => onReview(item)}
                  /> : type == 'Construction' ? <RealEstateListItem
                      grid
                      title={item.title}
                      subtitle={item.category_name}
                      status={item.status}
                      image={{uri:item.image}}
                      address={item.location}
                      favorite={isFavorite(item,'construction')}
                      style={{
                        marginLeft: 15,
                        marginBottom: 15,
                      }}
                      onPress={() => onProductDetail(item,'construction')}
                      onPressTag={() => onReview(item)}
                  /> : type == 'Coupons' ? <EventListItem
                      grid
                      title={item.title}
                      subtitle={item.code}
                      status={item.status}
                      image={{uri:item.image}}
                      style={{
                        marginLeft: 15,
                        marginBottom: 15,
                        flex:1
                      }}
                      favorite={isFavorite(item,'coupon')}
                      onPress={() => onProductDetail(item,'coupon')}
                      onPressTag={() => onReview(item)}
              /> : ''
            )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                sortSelected={filter?.sort}
                modeView={modeView}
                sortOption={setting?.sortOption}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onChangeLocationView={()=>setViewtype('map')}
                onFilter={onFilter}
                type={type}
              />
            </Animated.View>
          </View>
        );

      case 'list':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingHorizontal: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={lists}
              key={'list'}
              keyExtractor={(item, index) => `list ${index}`}
              onEndReached={()=>loadMore()}
              onEndThreshold={0.7}
              renderItem={({item, index}) => ( 
                type == 'Vehicles' ? <FoodListItem
                list
                title={item.title}
                subtitle={item.category_name}
                //status={item.status}
                image={{uri:item.image}}
                address={item.location}
                favorite={isFavorite(item,'vehicle')}
                style={{marginBottom: 15}}
                onPress={() => onProductDetail(item,'vehicle')}
                onPressTag={() => onReview(item)}
              /> : type == 'Items' ? <ListItem
                small
                image={{uri:item.image}}
                title={item.title}
                subtitle={item.category_name}
                location={item.location}
                //phone={item.phone}
                rate={item.rate}
                status={item.price}
                //numReviews={item.rate}
                favorite={isFavorite(item,'item')}
                style={{marginBottom: 15}}
                onPress={() => onProductDetail(item,'item')}
                onPressTag={() => onReview(item)}
              />  : type == 'Jobs' ? <ListItem
                list
                title={item.title}
                subtitle={item.business_name}
                status={item.status}
                image={{uri:item.image}}
                address={item.location}
                phone={item.salary_type}
                style={{marginBottom:5}}
                numReviews={item.job_type}
                favorite={isFavorite(item,'job')}
                onPress={() => onProductDetail(item,'job')}
                onPressTag={() => onReview(item)}
            /> : type == 'Properties' ? <RealEstateListItem
                list
                title={item.title}
                subtitle={item.property_type}
                status={item.available_for}
                address={item.location}
                image={{uri:item.image}}
                price={item.price}
                style={{marginBottom: 15}}
                favorite={isFavorite(item,'property')} 
                onPress={() => onProductDetail(item,'property')}
              /> : type == 'Construction' ? <RealEstateListItem
                list
                title={item.title}
                subtitle={item.category_name}
                status={item.status}
                address={item.location}
                image={{uri:item.image}}
                style={{marginBottom: 15}}
                favorite={isFavorite(item,'construction')} 
                onPress={() => onProductDetail(item,'construction')}
                  /> :  type == 'Coupons' ? <EventListItem
                  list
                  title={item.title}
                  subtitle={item.code}
                  status={item.status}
                  image={{uri:item.image}}
                  favorite={isFavorite(item,'coupon')}
                  onPress={() => onProductDetail(item,'coupon')}
                  onPressTag={() => onReview(item)}
              /> : ''
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                sortSelected={filter?.sort}
                modeView={modeView}
                sortOption={setting?.sortOption}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onChangeLocationView={()=>setViewtype('map')}
                onFilter={onFilter}
                type={type}
              />
            </Animated.View>
          </View>
        );
      default:
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingHorizontal: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={lists} 
              key={'block'}
              keyExtractor={(item, index) => `block ${index}`}
              onEndReached={()=>loadMore()}
              onEndThreshold={0.7}
              renderItem={({item, index}) => ( 
                type == 'Vehicles' ? <FoodListItem
                list
                title={item.title}
                subtitle={item.category_name}
                //status={item.status}
                image={{uri:item.image}}
                address={item.location}
                favorite={isFavorite(item,'vehicle')}
                style={{marginBottom: 15}}
                onPress={() => onProductDetail(item,'vehicle')}
                onPressTag={() => onReview(item)}
                /> : type == 'Items' ? <ListItem
                small
                image={{uri:item.image}}
                title={item.title}
                subtitle={item.category_name}
                location={item.location}
                //phone={item.phone}
                rate={item.rate}
                status={item.price}
                //numReviews={item.rate}
                favorite={isFavorite(item,'item')}
                style={{marginBottom: 15}}
                onPress={() => onProductDetail(item,'item')}
                onPressTag={() => onReview(item)}
              />  : type == 'Jobs' ? <ListItem
                list
                title={item.title}
                image={{uri:item.image}}
                subtitle={item.business_name}
                status={item.status}
                //image={item.image}
                style={{marginBottom:5}}
                address={item.location}
                phone={item.salary_type}
                numReviews={item.job_type}
                favorite={isFavorite(item,'job')}
                onPress={() => onProductDetail(item,'job')}
                onPressTag={() => onReview(item)}
            /> : type == 'Properties' ? <RealEstateListItem
                list
                title={item.title}
                subtitle={item.property_type}
                status={item.available_for}
                address={item.location}
                image={{uri:item.image}}
                price={item.price}
                style={{marginBottom: 15}}
                favorite={isFavorite(item,'property')} 
                onPress={() => onProductDetail(item,'property')}
              /> : type == 'Coupons' ? <EventListItem
                list
                title={item.title}
                subtitle={item.code}
                status={item.status}
                image={{uri:item.image}}
                favorite={isFavorite(item,'coupon')}
                onPress={() => onProductDetail(item,'coupon')}
                onPressTag={() => onReview(item)}
                /> : type == 'Construction' ? <ListItem
                list
                title={item.title}
                image={{uri:item.image}}
                subtitle={item.category_name}
                status={item.status}
                //image={item.image}
                address={item.location}
                favorite={isFavorite(item,'construction')}
                onPress={() => onProductDetail(item,'construction')}
                onPressTag={() => onReview(item)}
              /> : ''
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                sortSelected={filter?.sort}
                modeView={modeView}
                sortOption={setting?.sortOption}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onChangeLocationView={()=>setViewtype('map')}
                onFilter={onFilter}
                type={type}
              />
            </Animated.View>
          </View>
        );
    }
  };

  /**
   * render MapView
   * @returns
   */
  const renderMapView = () => {
    return (
      <View style={{flex: 1}}>
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
          {list.data?.map?.((item, index) => {
            return (
              <Marker
                onPress={e => onSelectLocation(e.nativeEvent.coordinate)}
                key={item.id}
                coordinate={{
                  latitude: item.location?.latitude,
                  longitude: item.location.longitude,
                }}>
                <View
                  style={[
                    styles.iconLocation,
                    {
                      backgroundColor:
                        index == active ? colors.primary : BaseColor.whiteColor,
                      borderColor: colors.primary,
                    },
                  ]}>
                  <Icon
                    name="star"
                    size={16}
                    color={
                      index == active ? BaseColor.whiteColor : colors.primary
                    }
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
        <View style={{position: 'absolute', bottom: 0, overflow: 'visible'}}>
          <Carousel
            ref={sliderRef}
            data={list.data ?? []}
            renderItem={({item, index}) => (
              <ListItem
                small
                image={item.image?.full}
                title={item.title}
                subtitle={item.category?.title}
                rate={item.rate}
                favorite={isFavorite(item)}
                style={{
                  margin: 3,
                  padding: 10,
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  shadowColor: colors.border,
                  shadowOffset: {
                    width: 3,
                    height: 2,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                onPress={() => onProductDetail(item,type)}
                onPressTag={() => onReview(item)}
              />
            )}
            sliderWidth={viewportWidth}
            itemWidth={getViewPort(75) + getViewPort(2) * 2}
            firstItem={1}
            inactiveSlideScale={0.95}
            inactiveSlideOpacity={0.85}
            contentContainerCustomStyle={{paddingVertical: 10}}
            loop={true}
            loopClonesPerSide={2}
            autoplay={false}
            onSnapToItem={index => {
              setActive(index);
              setRegion({
                latitudeDelta: 0.009,
                longitudeDelta: 0.004,
                latitude: list.data?.[index]?.location?.latitude,
                longitude: list.data?.[index]?.location?.longitude,
              });
            }}
          />
        </View>
      </View>
    );
  };

  /**
   * render Content view
   */
  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }
    //console.log(lists?.length);
    if (!lists) {
    //if (lists?.length == 0) {
      return (
        <View style={styles.centerView}>
          <View style={{alignItems: 'center'}}>
            <Icon
              name="frown-open"
              size={18}
              color={colors.text}
              style={{marginBottom: 4}}
            />
            <Text>{t('data_not_found')}</Text>
          </View>
        </View>
      );
    }
    if (viewtype=='map') return renderLocationSelect();
    if (mapView) return renderMapView();
    return renderList();
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={type}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Icon name="search" size={20} color={colors.primary} /> 
          );
        }}
        // renderRightSecond={() => {
        //   return <Icon name="search" size={20} color={colors.primary} />;
        // }}
        // onPressRightSecond={() => {
        //   navigation.navigate('SearchHistory', {lists: lists});
        // }}
        onPressRight={() => {
          navigation.navigate('SearchHistory', {lists: lists});
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
