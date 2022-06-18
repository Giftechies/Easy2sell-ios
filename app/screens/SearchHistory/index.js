import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import * as api from '@api';
import {
  Header,
  SafeAreaView,
  TextInput,
  Icon,
  Tag,
  Text,
  ListItem, 
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {ProductModel} from '@models';
import * as Utils from "@utils";
import {BaseCollection} from '../../api/response/collection';
import {useSelector} from 'react-redux';
import {wishlistSelect} from '@selectors';


let timeout;

export default function SearchHistory({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const wishlist = useSelector(wishlistSelect);
  //const search = BaseCollection.map(item => new ProductModel(item));
  const [history, setHistory] = useState(search);
  const [result, setResult] = useState([]);
  const [viewType, setViewType] = useState('job');
  const [showResult, setShowResult] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  //const { lists } = route?.params;
  const [collection, setCollection] = useState([]);
  const search = collection.map(item => item);
  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = (item,type) => {
    return wishlist.list?.some(i => { return i.item_id == item.id && type.toLowerCase() == i.type;});
  };

  useEffect(() => {  
    // const params = {
    //   lists: lists
    // };
    // console.log(lists);
    // setCollection(lists);
  },[]);

  /**
   * call when search data
   * @param {*} keyword
   */
  const onSearch = (keyword) => {
    setKeyword(keyword);
    // console.log(keyword);
    if (keyword != '') {
      setLoading(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        searchQuery(keyword);
        // setResult(
        //   search.filter(item => {
        //     //console.log(item);
        //     return item.title.toUpperCase().includes(keyword.toUpperCase());
        //   }),
        // );
        
        setLoading(false);
        setShowResult(true);
      }, 1000);
    } else {
      setShowResult(false);
    }
  };

  const searchQuery = async(keyword) => {
    setViewType('job');
    try {
      const params = {
          term:keyword
      };
      const response = await api.search(params);
      if(response.success){
        if(response.data?.job?.length){
          setViewType('job');
        }else if(response.data?.property?.length){
          setViewType('property');
        }else if(response.data?.vehicle?.length){
          setViewType('vehicle');
        }else if(response.data?.coupon?.length){
          setViewType('coupon');
        }else if(response.data?.item?.length){
          setViewType('item');
        }else if(response.data?.construction?.length){
          setViewType('construction');
        }
        setResult(response.data);
      }
        
    } catch (error) {
        Alert.alert({
            title: t('search'),
            message: error.data ?? error.code ?? error.message ?? error.msg,
        });
    }
  }

  /**
   * on load detail and save history
   * @param {*} item
   */
  const onDetail = item => {
    navigation.navigate('ProductDetail', {
      item: item,
    });
  };

  /**
   * on clear
   */
  const onClear = () => {
    setHistory([]);
  };

  const showView = (type) => {
    setViewType(type);
  };



  /**
   * render content
   *
   */
  const renderContent = () => {
    if (showResult) {
      return (
        <>
        <View style={[styles.wrapContent, { borderColor: colors.border,marginBottom:20 }]}>
          {Object.keys(result)?.map?.((item) => {
            return (
              <Tag
              onPress={() =>showView(item)}
                key={item.toString()}
                outline={viewType==item?false:true}
                primary={viewType==item?true:false}
                style={{
                  marginTop: 8,
                  marginRight: 8,
                  paddingHorizontal:5,
                }}
              >
                {Utils.camelCase(item)}
              </Tag>
            );
          })}
        </View>
        {viewType=='job' && result?.job?.length ? 
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          data={result?.job}
          keyExtractor={(item, index) => `history ${index}`}
          renderItem={({item, index}) => (
            item.type == 'job'?
            <ListItem
              small
              image={{uri:item.searchable.image}}
              title={item.searchable.title}
              subtitle={item.searchable.category_name}
              status={item.searchable.status}
              //image={item.image}
              address={item.searchable.location}
              phone={item.searchable.salary_type}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.searchable,
                  type:'job'
                })
              }
            />:null
          
          )}
        />:null}
        {viewType=='property' && result?.property?.length ? 
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          data={result?.property}
          keyExtractor={(item, index) => `history ${index}`}
          renderItem={({item, index}) => (
            item.type == 'property' ?
            <ListItem
              small
              image={{uri:item.searchable.image}}
              title={item.searchable.title}
              subtitle={item.searchable.property_type}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.searchable,
                  type:'property'
                })
              }
            />:null
          
          )}
        />:null}
        
        {viewType=='item' && result?.item?.length ? 
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          data={result?.item}
          keyExtractor={(item, index) => `history ${index}`}
          renderItem={({item, index}) => (
            item.type == 'item'?
            <ListItem
              small
              image={{uri:item.searchable.image}}
              title={item.searchable.title}
              subtitle={item.searchable.category_name}
              location={item.searchable.location}
              //phone={item.phone}
              status={item.searchable.price}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.searchable,
                  type:'item'
                })
              }
            />:null
          
          )}
        />:null}
        
        {viewType=='coupon' && result?.coupon?.length ? 
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          data={result?.coupon}
          keyExtractor={(item, index) => `history ${index}`}
          renderItem={({item, index}) => (
            item.type=='coupon'?
            <ListItem
            small
              title={item.searchable.title}
              subtitle={item.searchable.code}
              status={item.searchable.status}
              image={{uri:item.searchable.image}}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item.searchable,
                  type:'coupon'
                })
              }
            />:null
          
          )}
        />:null}
        
        {viewType=='vehicle' && result?.vehicle?.length ? 
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          data={result?.vehicle}
          keyExtractor={(item, index) => `history ${index}`}
          renderItem={({item, index}) => (
            item.type=='vehicle'?
              <ListItem
              small
                title={item.searchable.title}
                subtitle={item.searchable.category_name}
                image={{uri:item.searchable.image}}
                address={item.searchable.location}
                style={{ marginBottom: 15 }}
                onPress={() =>
                  navigation.navigate("ProductDetail", {
                    item: item.searchable,
                    type:'vehicle'
                  })
                }
              />:null
          )}
        />:null}
        {viewType=='construction' && result?.construction?.length ? 
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          data={result?.construction}
          keyExtractor={(item, index) => `history ${index}`}
          renderItem={({item, index}) => (
            item.type=='construction'?
              <ListItem
              small
                title={item.searchable.title}
                subtitle={item.searchable.category_name}
                image={{uri:item.searchable.image}}
                address={item.searchable.location}
                style={{ marginBottom: 15 }}
                onPress={() =>
                  navigation.navigate("ProductDetail", {
                    item: item.searchable,
                    type:'construction'
                  })
                }
              />:null
          )}
        />:null}
        </>
      );
    }

    return (
      <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
        {/* <View style={styles.rowTitle}>
          <Text headline>{t('search_history').toUpperCase()}</Text>
          <TouchableOpacity onPress={onClear}>
            <Text caption1 accentColor>
              {t('clear')}
            </Text>
          </TouchableOpacity>
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {history?.map?.((item, index) => (
            <TouchableOpacity
              style={[styles.itemHistory, {backgroundColor: colors.card}]}
              onPress={() => onDetail(item)}
              key={`search ${index}`}>
              <Text caption2>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('search')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <View style={{flex: 1}}>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <TextInput
              placeholder={t('search')}
              value={keyword}
              onSubmitEditing={() => {
                onSearch(keyword);
              }}
              onChangeText={onSearch}
              icon={
                <TouchableOpacity
                  onPress={() => {
                    onSearch('');
                  }}
                  style={styles.btnClearSearch}>
                  <Icon name="times" size={18} color={BaseColor.grayColor} />
                </TouchableOpacity>
              }
            />
          </View>
          {renderContent()}
        </View>
      </SafeAreaView>
    </View>
  );
}
