import React, {useState} from 'react';
import {FlatList, RefreshControl, View, ActivityIndicator} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  RealEstateListItem,
  Text,
  Icon,
} from '@components';
import {wishlistSelect} from '@selectors';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {wishListActions} from '@actions';
import styles from './styles';

export default function WishlistRealEstate({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wishlistSelect);

  const [refreshing, setRefresh] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /**
   * Reload wishlist
   */
  const onRefresh = () => {
    setRefresh(false);
  };

  /**
   * Action Delete/Reset
   */
  const onDelete = item => {
    setDeleting(true);
    setTimeout(() => {
      dispatch(wishListActions.onDelete(item));
      setDeleting(false);
    }, 1000);
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
   * render content wishlist
   * @returns
   */
  const renderContent = () => {
    if (wishlist.list?.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{paddingTop: 15}}
          style={styles.contentList}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={wishlist.list}
          keyExtractor={(item, index) => `whishlist ${index}`}
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
              favorite={true}
              style={{marginBottom: 15}}
              onPress={() => onProductDetail(item)}
            />
          )}
        />
      );
    }

    if (wishlist.list?.length == 0) {
      return (
        <View style={styles.loadingContent}>
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

    return (
      <FlatList
        contentContainerStyle={{paddingTop: 15}}
        style={styles.contentList}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        keyExtractor={(item, index) => `empty ${index}`}
        renderItem={({item, index}) => (
          <RealEstateListItem list loading={true} style={{marginBottom: 15}} />
        )}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('wishlist')}
        renderRight={() => {
          if (deleting) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
          return <Icon name="trash-alt" size={16} color={colors.text} />;
        }}
        onPressRight={() => onDelete()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
