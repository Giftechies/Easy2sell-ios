import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {
  SafeAreaView,
  Icon,
  Text,
  Image,
  RealEstateListItem,
  ModalFilter,
} from '@components';
import styles from './styles';
import {useSelector, useDispatch} from 'react-redux';
import {homeSelect, wishlistSelect, designSelect} from '@selectors';
import {useTranslation} from 'react-i18next';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import {homeActions} from '@actions';

export default function HomeRealEstate({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const home = useSelector(homeSelect);
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const dispatch = useDispatch();

  const [countrys, setCountry] = useState(null);
  const [countrySelected, setCountrySelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      homeActions.onLoad(design, response => {
        setRefreshing(false);
      }),
    );
  };

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = item => {
    return wishlist.list?.some(i => i.id == item.id);
  };

  /**
   *
   * onOpen ChooseBusiness
   */
  const onChooseBusiness = () => {
    navigation.navigate('ChooseBusiness');
  };

  /**
   * on navigate to List
   *
   */
  const onListView = item => {
    navigation.navigate('List');
  };

  /**
   * on navigate to Product detail
   *
   */
  const onProductDetail = item => {
    navigation.navigate('ProductDetail', {
      item: item,
    });
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
   * render country selected
   */
  const renderCountry = () => {
    if (countrys?.length > 0) {
      return (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <Text body2>{countrySelected.text}</Text>
          <View style={styles.selectLocation}>
            <Text overline grayColor style={{paddingRight: 4}}>
              {t('select_location')}
            </Text>
            <Icon
              name="angle-down"
              size={10}
              color={BaseColor.grayColor}
              solid
            />
          </View>
          <ModalFilter
            options={countrys}
            isVisible={modalVisible}
            onSwipeComplete={() => {
              setModalVisible(false);
            }}
            onApply={onChangeCountry}
            onSelectFilter={onSelectCountry}
          />
        </TouchableOpacity>
      );
    }

    return <ActivityIndicator size="small" color={colors.primary} />;
  };

  /**
   * render list Location
   */
  const renderLocation = () => {
    if (home?.locations?.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 20,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={home?.locations}
          keyExtractor={(item, index) => `Location ${index}`}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={onListView}>
                <View
                  style={{
                    paddingHorizontal: 12,
                    marginBottom: 10,
                  }}>
                  <Image source={item.image} style={styles.locationImage} />
                </View>
                <Text footnote>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      );
    }

    return (
      <FlatList
        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: 20,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `Location ${index}`}
        renderItem={({item, index}) => {
          return (
            <View style={{paddingHorizontal: 12}}>
              <Placeholder Animation={Progressive} key={`category${item}`}>
                <View style={{alignItems: 'center'}}>
                  <PlaceholderMedia style={styles.locationImage} />
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
  };

  const renderPopular = () => {
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

    if (home?.populars?.length > 0) {
      list = (
        <FlatList
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={home?.populars}
          keyExtractor={(item, index) => `popular${index}`}
          renderItem={({item, index}) => (
            <RealEstateListItem
              grid
              title={item.title}
              subtitle={item.subtitle}
              status={item.status}
              image={item.image}
              price={item.price}
              favorite={isFavorite(item)}
              style={{
                marginLeft: 15,
                width: 200,
              }}
              onPress={() => onProductDetail(item)}
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
   * render content recommend
   * @returns
   */
  const renderRecommend = () => {
    let list = (
      <View style={{paddingHorizontal: 20}}>
        {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <RealEstateListItem
              key={`recommend ${index}`}
              loading={true}
              list
              style={{marginBottom: 15}}
            />
          );
        })}
      </View>
    );

    if (home?.recommends?.length > 0) {
      list = (
        <View style={{paddingHorizontal: 20}}>
          {home?.recommends.map((item, index) => {
            return (
              <RealEstateListItem
                key={`recommend ${index}`}
                list
                title={item.title}
                subtitle={item.subtitle}
                status={item.status}
                image={item.image}
                price={item.price}
                address={item.address}
                location={item.location}
                favorite={isFavorite(item)}
                style={{marginBottom: 15}}
                onPress={() => onProductDetail(item)}
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
            {t('recommend_for_you')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}>
            <Text body2 grayColor>
              {t('let_find_best_price')}
            </Text>
            <TouchableOpacity onPress={onListView}>
              <Text body2 accentColor>
                {t('view_all')}
              </Text>
            </TouchableOpacity>
          </View>
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
    return (
      <View style={{flex: 1}}>
        <View style={styles.contentHeader}>
          <Text header bold>
            {t('realestate')}
          </Text>
          {renderCountry()}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchHistory')}
          style={styles.contentSearch}>
          <View style={[BaseStyle.textInput, {backgroundColor: colors.card}]}>
            <Text body1 grayColor style={{flex: 1}}>
              {t('search_real_estate')}
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
          {renderLocation()}
          {renderPopular()}
          {renderRecommend()}
        </ScrollView>
        <TouchableOpacity
          onPress={onChooseBusiness}
          style={[styles.menuIcon, {backgroundColor: colors.primary}]}>
          <Icon name="plus" size={16} color={BaseColor.whiteColor} solid />
        </TouchableOpacity>
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
