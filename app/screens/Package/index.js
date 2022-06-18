import React, {useState, useRef, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated, Alert} from 'react-native';
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
  PackageItem,
  ListItem,
  Button,
  Text,
} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  settingSelect,
  userSelect,
} from '@selectors';
import {listActions} from '@actions';

export default function List({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(userSelect);

  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState({});

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

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {  
    const params = {
    };
    getPackages(params);
  },[]);

  /**
   * on refresh list
   *
   */
  const selectItem = (item) => {
      if(selected && selected.id==item.id){
        setSelected(null);
      }else{
        setSelected(item);
      }
  };


  const onRefresh = () => {
    setRefreshing(true);
    const params = {
    };
    //console.log(params);
    getPackages(params);
  };
  
  const getPackages = async(params) => {
    try {
      const response = await api.getPackages(params);
      if(response.success){
        setPackages(response.data);
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      Alert.alert({
          title: t('loading_packages'),
          message: error.data ?? error.code ?? error.message ?? error.msg,
      });
      //console.log("error");
    }
    
    setLoading(false);
    setRefreshing(false);
  }

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
        </View>
    );
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
                data={packages} 
                key={'block'}
                keyExtractor={(item, index) => `block ${index}`}
                renderItem={({item, index}) => ( 
                    <PackageItem
                        title={item.title}
                        checked={selected?.id==item.id}
                        subtitle={item.description}
                        price={item.price}
                        ads={item.qty}
                        days={item.days}
                        onPress={() => selectItem(item)}
                    />
                )}
            />
            {console.log(selected)}
            
            <Button
                disabled={selected}
                full
                style={{marginTop: 20,opacity:selected?1:0.5}}
                loading={loading}
                onPress={() => {}}>
                {t('Purchase')}
            </Button>
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
    
    if (!packages) {
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
    return renderList();
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('membership')}
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
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
