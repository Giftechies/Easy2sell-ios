import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  TextInput,
  Icon,
  Text,
  RealEstateListItem,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {wishlistSelect} from '@selectors';
import {RealEstateCollection} from '../../api/response/collection';
let timeout;

export default function SearchHistoryRealEstate({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const search = RealEstateCollection;
  const wishlist = useSelector(wishlistSelect);

  const [history, setHistory] = useState(search);
  const [result, setResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = item => {
    return wishlist.list?.some(i => i.id == item.id);
  };

  /**
   * call when search data
   * @param {*} keyword
   */
  const onSearch = keyword => {
    setKeyword(keyword);
    if (keyword != '') {
      setLoading(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setResult(
          search.filter(item => {
            return item.title.toUpperCase().includes(keyword.toUpperCase());
          }),
        );
        setLoading(false);
        setShowResult(true);
      }, 1000);
    } else {
      setShowResult(false);
    }
  };

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

  /**
   * render content
   *
   */
  const renderContent = () => {
    if (showResult) {
      return (
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          data={result}
          keyExtractor={(item, index) => `history ${index}`}
          renderItem={({item, index}) => (
            <RealEstateListItem
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
              onPress={() => onDetail(item)}
            />
          )}
        />
      );
    }

    return (
      <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
        <View style={styles.rowTitle}>
          <Text headline>{t('search_history').toUpperCase()}</Text>
          <TouchableOpacity onPress={onClear}>
            <Text caption1 accentColor>
              {t('clear')}
            </Text>
          </TouchableOpacity>
        </View>
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
