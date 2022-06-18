import React, {useState, useRef, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated, Alert,TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BaseStyle, BaseColor, useTheme} from '@config';
import Carousel from 'react-native-snap-carousel';
import * as actionTypes from "@actions/actionTypes";
import { SettingModel } from "@models";
import * as api from '@api';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  designSelect,
} from '@selectors';
import {listActions} from '@actions';

export default function ItemCategories({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const design = useSelector(designSelect);

  const { type } = route?.params;
  const [lists, setLists] = useState([]);

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
  const [viewportWidth] = useState(Utils.getWidthDevice());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mainSelectedCategory, setMainSelectedCategory] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);

  // useEffect(() => {
  //   dispatch(
  //     listActions.onLoadList(route.params?.filter, design, () => {
  //       setLoading(false);
  //       setRefreshing(false);
  //     }),
  //   );
  // }, [design, dispatch, route.params?.filter]);

  useEffect(() => {  
      getMainCategories();
  },[]);

  getMainCategories = async() => {
    const response = await api.getItemCategories();
    if(response.success){
      setMainCategories(response.data);
    }else{
        Alert.alert({
            title: t('categories'),
            message: response.error ,
        });
    }
  }
  /**
   * on refresh list
   *
   */
  const onRefresh = () => {
    setRefreshing(true);
    //console.log(params);
    getMainCategories();
    setRefreshing(false);
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
   * @description Called when filtering option > category
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */
  const onSelectMainCategory = select => {
      setMainSelectedCategory(select);
      navigation.navigate('List', {type:type,mainCategory:select}); 
  };


  /*
  * render Categories
  * @returns
  * 
  */

  const renderMainCategoryList = () => {
   
    return (
    <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
      {mainCategories &&
      <FlatList
            data={mainCategories}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => {
              const selected = mainSelectedCategory && item.id == mainSelectedCategory.id;
              //console.log(hasChild);
              
              return (
                <>
                <TouchableOpacity key={item.id}
                  style={[styles.item, { borderBottomColor: colors.border }]}
                  onPress={() => onSelectMainCategory(item)}
                >
                  
                  <Text
                    body2                    
                    style={[
                      selected
                        ? {
                            color: colors.primary,
                          }
                        : {}
                    ]
                    }
                  >
                    {item.name}
                  </Text>
                  {selected && (
                    <Icon name="check" size={14} color={colors.primary} />
                  )}
                </TouchableOpacity>
                
                </>
              );
            }}
          />
      }
    </View>
    );
  }


  return (
    <View style={{flex: 1}}>
      <Header
        title={t('categories')}
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
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
      {renderMainCategoryList()}
      </SafeAreaView>
    </View>
  );
}
