import React, {useState, useRef, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BaseStyle, BaseColor, useTheme} from '@config';
import Carousel from 'react-native-snap-carousel';
import {
  Header,
  SafeAreaView,
  Icon,
  RealEstateListItem,
  FilterSort,
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
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wishlistSelect);
  const list = useSelector(listSelect);
  const design = useSelector(designSelect);
  const setting = useSelector(settingSelect);
  const user = useSelector(userSelect);

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
  const [filter, setFilter] = useState(route.params?.filter);
  const [active, setActive] = useState(0);
  const [viewportWidth] = useState(Utils.getWidthDevice());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modeView, setModeView] = useState(setting.mode);
  const [mapView, setMapView] = useState(false);
  const [region, setRegion] = useState({
    latitude: 0.0,
    longitude: 0.0,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });

  useEffect(() => {
    dispatch(
      listActions.onLoadList(route.params?.filter, design, () => {
        setLoading(false);
        setRefreshing(false);
      }),
    );
  }, [design, dispatch, route.params?.filter]);

  /**
   * on Load data
   *
   */
  const loadData = filter => {
    dispatch(
      listActions.onLoadList(filter, design, () => {
        setLoading(false);
        setRefreshing(false);
      }),
    );
  };

  /**
   * on refresh list
   *
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
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
      filter.sort = sort;
      setFilter(filter);
      loadData(filter);
    }
  };

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onFilter = () => {
    navigation.navigate('Filter', {
      filter,
      onApply: filter => {
        setFilter(filter);
        loadData(filter);
      },
    });
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
        latitude: list?.data?.[0].location.latitude,
        longitude: list?.data?.[0].location.longitude,
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
  const onProductDetail = item => {
    navigation.navigate('ProductDetail', {
      item: item,
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
  const isFavorite = item => {
    return wishlist.list?.some(i => i.id == item.id);
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
              renderItem={({item, index}) => (
                <RealEstateListItem block loading={true} />
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
                onFilter={onFilter}
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
                <RealEstateListItem
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
                onFilter={onFilter}
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
                <RealEstateListItem
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
                onFilter={onFilter}
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
              renderItem={({item, index}) => (
                <RealEstateListItem block loading={true} />
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
                onFilter={onFilter}
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
              data={list.data}
              key={'block'}
              keyExtractor={(item, index) => `block ${index}`}
              renderItem={({item, index}) => (
                <RealEstateListItem
                  block
                  title={item.title}
                  subtitle={item.subtitle}
                  status={item.status}
                  image={item.image}
                  address={item.address}
                  phone={item.phone}
                  numReviews={item.numberRate}
                  favorite={isFavorite(item)}
                  onPress={() => onProductDetail(item)}
                  onPressTag={() => onReview(item)}
                />
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
                onFilter={onFilter}
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
              data={list.data}
              key={'gird'}
              keyExtractor={(item, index) => `gird ${index}`}
              renderItem={({item, index}) => (
                <RealEstateListItem
                  grid
                  title={item.title}
                  subtitle={item.subtitle}
                  status={item.status}
                  image={item.image}
                  address={item.address}
                  price={item.price}
                  favorite={isFavorite(item)}
                  style={{
                    marginLeft: 15,
                    marginBottom: 15,
                  }}
                  onPress={() => onProductDetail(item)}
                  onPressTag={() => onReview(item)}
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
                onFilter={onFilter}
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
              data={list.data}
              key={'list'}
              keyExtractor={(item, index) => `list ${index}`}
              renderItem={({item, index}) => (
                <RealEstateListItem
                  list
                  title={item.title}
                  subtitle={item.subtitle}
                  status={item.status}
                  image={item.image}
                  address={item.address}
                  price={item.price}
                  favorite={isFavorite(item)}
                  style={{marginBottom: 15}}
                  onPress={() => onProductDetail(item)}
                  onPressTag={() => onReview(item)}
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
                onFilter={onFilter}
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
              data={list.data}
              key={'block'}
              keyExtractor={(item, index) => `block ${index}`}
              renderItem={({item, index}) => (
                <RealEstateListItem
                  block
                  title={item.title}
                  subtitle={item.subtitle}
                  status={item.status}
                  image={item.image}
                  address={item.address}
                  phone={item.phone}
                  numReviews={item.numberRate}
                  favorite={isFavorite(item)}
                  onPress={() => onProductDetail(item)}
                  onPressTag={() => onReview(item)}
                />
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
                onFilter={onFilter}
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
              <RealEstateListItem
                list
                title={item.title}
                subtitle={item.subtitle}
                status={item.status}
                image={item.image}
                address={item.address}
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
                onPress={() => onProductDetail(item)}
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
    if (list.data?.length == 0) {
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
    if (mapView) return renderMapView();
    return renderList();
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('place')}
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
            <Icon
              name={mapView ? 'align-right' : 'map'}
              size={20}
              color={colors.primary}
            />
          );
        }}
        renderRightSecond={() => {
          return <Icon name="search" size={20} color={colors.primary} />;
        }}
        onPressRightSecond={() => {
          navigation.navigate('SearchHistory');
        }}
        onPressRight={() => {
          onChangeMapView();
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
