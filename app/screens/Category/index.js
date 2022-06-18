import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, View, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CategoryFull,
  CategoryIcon,
  TextInput,
} from '@components';
import * as Utils from '@utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {productActions} from '@actions';
import {FilterModel} from '@models';

export default function Category({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('icon');
  const [category, setCategory] = useState([]);
  const [origin, setOrigin] = useState([]);

  useEffect(() => {
    dispatch(
      productActions.onFetchCategory(null, data => {
        setCategory(data);
        setOrigin(data);
        setRefreshing(false);
      }),
    );
  }, [dispatch]);

  /**
   * on Refresh category
   */
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      productActions.onFetchCategory(null, data => {
        setCategory(data);
        setOrigin(data);
        setRefreshing(false);
      }),
    );
  };

  /**
   * call when change mode view
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'full':
        setModeView('icon');
        break;
      case 'icon':
        setModeView('full');
        break;
    }
  };

  /**
   * call when search category
   */
  const onSearch = search => {
    if (!search) {
      setCategory(origin);
    } else {
      setCategory(
        category.filter(item => {
          return item.title.toUpperCase().includes(search.toUpperCase());
        }),
      );
    }
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
   * render Item category
   * @param {*} item
   * @param {*} index
   * @returns
   */
  const renderItem = (item, index) => {
    switch (modeView) {
      case 'icon':
        return (
          <CategoryIcon
            icon={Utils.iconConvert(item.icon)}
            color={item.color}
            title={item.title}
            subtitle={item.count.toString()}
            onPress={() => onListView(item.title)}
            style={[styles.itemIcon, {borderColor: colors.border}]}
          />
        );
      case 'full':
        return (
          <CategoryFull
            image={{uri:item.image}}
            color={item.color}
            icon={Utils.iconConvert(item.icon)}
            title={item.title}
            subtitle={item.count.toString()}
            onPress={() => onListView(item.title)}
            style={{
              marginBottom: 15,
            }}
          />
        );
      default:
        break;
    }
  };

  /**
   * render content
   * @returns
   */
  const renderContent = () => {
    let list = (
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `Category ${index}`}
        renderItem={({item, index}) => {
          return (
            <CategoryFull
              loading={true}
              style={{
                marginBottom: 15,
              }}
            />
          );
        }}
      />
    );
    if (category.length > 0) {
      list = (
        <FlatList
          contentContainerStyle={{
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
          data={category}
          keyExtractor={(item, index) => `Category ${index}`}
          renderItem={({item, index}) => renderItem(item, index)}
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <TextInput
            onChangeText={text => setSearch(text)}
            placeholder={t('search')}
            value={search}
            onSubmitEditing={() => onSearch(search)}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                  onSearch('');
                }}>
                <Icon name="times" size={16} color={BaseColor.grayColor} />
              </TouchableOpacity>
            }
          />
        </View>
        {list}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('category')}
        renderRight={() => {
          return (
            <Icon
              name={modeView == 'full' ? 'th-large' : 'th-list'}
              size={20}
              color={BaseColor.grayColor}
            />
          );
        }}
        onPressRight={onChangeView}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
