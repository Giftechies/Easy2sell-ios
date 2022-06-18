import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {BaseStyle, useTheme, Images, BaseColor} from '@config';
import {SafeAreaView, Icon, Text, Image, EventListItem} from '@components';
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

export default function HomeEvent({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const home = useSelector(homeSelect);
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  /**
   * on Refresh category
   */
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      homeActions.onLoad(design, () => {
        setRefreshing(false);
      }),
    );
  };

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = item => {
    return wishlist.list?.some(i => i.id === item.id);
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
    navigation.navigate('Notification');
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
   * render list Location
   */
  const renderCategory = () => {
    if (home?.categories?.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 20,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={home?.categories}
          keyExtractor={(item, index) => `Category ${index}`}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{alignItems: 'center', paddingHorizontal: 20}}
                onPress={onListView}>
                <View
                  style={[
                    styles.categoryContent,
                    {backgroundColor: item.color + '4D'},
                  ]}>
                  <Icon name={item.icon} size={32} color={item.color} />
                </View>
                <Text
                  footnote
                  style={{
                    marginTop: 10,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      );
    }

    return (
      <FlatList
        contentContainerStyle={{
          marginTop: 20,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `Category ${index}`}
        renderItem={({item, index}) => {
          return (
            <View style={{paddingHorizontal: 20}}>
              <Placeholder Animation={Progressive}>
                <View style={{alignItems: 'center'}}>
                  <PlaceholderMedia style={styles.categoryContent} />
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

  /**
   * render list Feature
   */
  const renderFeature = () => {
    let list = (
      <FlatList
        contentContainerStyle={{paddingLeft: 20}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `popular${index}`}
        renderItem={({item, index}) => (
          <EventListItem
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

    if (home?.features?.length > 0) {
      list = (
        <FlatList
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={home?.features}
          keyExtractor={(item, index) => `popular${index}`}
          renderItem={({item, index}) => (
            <EventListItem
              grid
              title={item.title}
              subtitle={item.subtitle}
              status={item.status}
              image={item.image}
              address={item.address}
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
            {t('feature_event')}
          </Text>
          <Text body2 grayColor style={{marginTop: 4}}>
            {t('let_find_event')}
          </Text>
        </View>
        {list}
      </View>
    );
  };

  /**
   * render content new event
   * @returns
   */
  const renderNewEvent = () => {
    let list = (
      <View style={{paddingHorizontal: 20}}>
        {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <EventListItem
              key={`NewEvent ${index}`}
              loading={true}
              list
              style={{marginBottom: 15}}
            />
          );
        })}
      </View>
    );

    if (home?.news?.length > 0) {
      list = (
        <View style={{paddingHorizontal: 20}}>
          {home?.news.map((item, index) => {
            return (
              <EventListItem
                key={`NewEvent ${index}`}
                list
                title={item.title}
                subtitle={item.date}
                status={item.status}
                image={item.image}
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
            {t('new_event')}
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
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}>
            <Text subhead grayColor>
              Dec 01 2020
            </Text>
            <Text headline semibold style={{marginTop: 4}}>
              Hello Steve Garrett
            </Text>
          </View>
          <TouchableOpacity
            style={styles.avatarContent}
            onPress={() => onNotification()}>
            <Image style={styles.avatar} source={Images.profile2} />
            <View
              style={[
                styles.doc,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.card,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchHistory')}
          style={styles.contentSearch}>
          <View style={[BaseStyle.textInput, {backgroundColor: colors.card}]}>
            <Text body1 grayColor style={{flex: 1}}>
              {t('search_event')}
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
          {renderCategory()}
          {renderFeature()}
          {renderNewEvent()}
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
