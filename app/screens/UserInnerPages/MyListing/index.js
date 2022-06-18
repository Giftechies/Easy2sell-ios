import React, {useState, useRef, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import Modal from "react-native-modal";
import * as api from '@api';
import {
  Header,
  SafeAreaView,
  Icon,
  ListItem,
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

export default function MyListing({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const wishlist = useSelector(wishlistSelect);
  const user = useSelector(userSelect);

  const { type } = route?.params??{};
  const [lists, setLists] = useState([]);

  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const [deleting, setDeleting] = useState(false);
  const [actionItem, setActionItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  const [page, setPage] = useState(1);
  const [viewportWidth] = useState(Utils.getWidthDevice());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {  
    const params = {
      type: type,
      page: page,
      userid:user?.id
    };
    getList(params);
  },[]);

  /**
   * on refresh list
   *
   */
  const onRefresh = () => {
    setRefreshing(true);
    let firstpage=1;
    const params = {
      type: type,
      page: firstpage
    };
    getList(params);
  };

  /**
   * on refresh list
   *
   */
   const loadMore = () => {
    setRefreshing(true);
    const params = {
      type: type,
      page: page
    };
    getList(params);
  };

  /**
   * Open action
   * @param {*} item
   */
   const onClickDelete = () => {
    setModalVisible(false);
    Alert.alert({
      title: 'Delete',
      message: `${t("do_you_want_delete")} ?`,
      action: [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("Yes"),
          onPress: () => onDelete(),
        },
      ],
    });
  };

  /**
   * Action Delete/Reset
   **/
   const onDelete = async () => {
    setDeleting(true);
    let params = {
      id:actionItem.id,
      type:originalType(type)
    }

    try {
      const response = await api.deletePost(params,null);
      if(response.success){
        setLoading(false);
        setRefreshing(false);
        var newArrayList = [];
        newArrayList = lists.filter(item => item.id != actionItem.id);
        setLists(newArrayList);
        setActionItem(null);
      }else{
        Alert.alert({
            title: t('delete'),
            message: response.error,
        });
      }
    } catch (error) {
      Alert.alert({
          title: t('delete'),
          message: error.data ?? error.code ?? error.message ?? error.msg,
      });
    }
    setDeleting(false);
  };

  /**
   * Action for share
   */
  const onEdit = async (item) => {
    setModalVisible(false);
    switch (originalType(type)) {
      case 'property':
        navigation.navigate('EditRealEstate', {
          item: item,
          type:originalType(type)
        });
        break;
      case 'item':
        navigation.navigate('EditItem', {
          item: item,
          type:originalType(type)
        });
        break;
      case 'construction':
        navigation.navigate('EditConstruction', {
          item: item,
          type:originalType(type)
        });
        break;
      case 'job':
        navigation.navigate('EditJob', {
          item: item,
          type:originalType(type)
        });
        break;
      case 'coupon':
        navigation.navigate('EditCoupon', {
          item: item,
          type:originalType(type)
        });
        break;
      case 'vehicle':
        navigation.navigate('EditVehicle', {
          item: item,
          type:originalType(type)
        });
        break;
      default:
        return '';
    }
  };
  
  const originalType = (ptype) => {
    switch (ptype) {
      case 'Properties':
        return 'property';
        break;
      case 'Items':
          return 'item';
          break;
      case 'Construction':
        return 'construction';
        break;
      case 'Jobs':
          return 'job';
          break;
      case 'Coupons':
        return 'coupon';
        break;
      case 'Vehicles':
        return 'vehicle';
        break;
      default:
        return ptype;
    }
  };

  
  /**
   * render UI Modal action
   * @returns
   */
   const renderModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setActionItem(null);
        }}
        swipeDirection={["down"]}
        style={styles.bottomModal}
      >
        <SafeAreaView
          style={[styles.contentFilterBottom, { backgroundColor: colors.card }]}
        >
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setActionItem(null);
            }}
          >
            <Icon name="times" size={12} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onEdit(actionItem);
            }}
            style={[
              styles.contentActionModalBottom,
              { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
          >
            <Icon name="edit" size={18} color={colors.text} />
            <Text body2 semibold style={{ marginLeft: 15 }}>
              {t("edit")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentActionModalBottom]}
            onPress={() => {
              onClickDelete();
            }}
          >
            <Icon name="trash-alt" size={18} color={colors.text} />
            <Text body2 semibold style={{ marginLeft: 15 }}>
              {t("remove")}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
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
  
  const getList = async(params) => {
    try {
      const response = await api.getUserListing(params);
      if(response.success){
        setLoading(false);
        setRefreshing(false);
        if(response?.data?.current_page && response?.data?.current_page==1){
          setLists(response?.data?.data);
        }else{
          setLists([...lists, ...response?.data?.data]);
        }
        setPage(response?.data?.current_page+1);
      }
    } catch (error) {
      Alert.alert({
          title: t('loading_list'),
          message: error.data ?? error.code ?? error.message ?? error.msg,
      });
      //console.log("error");
    }
    
    setLoading(false);
    setRefreshing(false);
  }
  
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
          renderItem={({item, index}) => <ListItem list loading={true} />}
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
          data={lists} 
          key={'block'}
          keyExtractor={(item, index) => `block ${index}`}
          onEndReached={()=>loadMore()}
          onEndThreshold={0}
          renderItem={({item, index}) => ( 
            type == 'Properties' ?
            <ListItem
              small
              enableAction={true}
              image={{uri:item.image}}
              title={item.title}
              subtitle={item.property_type}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item,
                  type:'property'
                })
              }
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:type == 'Construction' ?
            <ListItem
              small
              enableAction={true}
              title={item.title}
              image={{uri:item.image}}
              subtitle={item.category_name}
              status={item.status}
              //image={item.image}
              address={item.location}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item,
                  type:'construction'
                })
              }
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:type=='Vehicles'?
            <ListItem
              small
              enableAction={true}
              title={item.title}
              subtitle={item.category_name}
              image={{uri:item.image}}
              address={item.location}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item,
                  type:'vehicle'
                })
              }
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:type=='Coupons'?
            <ListItem
              enableAction={true}
              small
              title={item.title}
              subtitle={item.code}
              status={item.status}
              image={{uri:item.image}}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item,
                  type:'coupon'
                })
              }
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:type == 'Jobs'?
            <ListItem
              small
              enableAction={true}
              image={{uri:item.image}}
              title={item.title}
              subtitle={item.category_name}
              status={item.status}
              //image={item.image}
              address={item.location}
              phone={item.salary_type}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item,
                  type:'job'
                })
              }
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:type == 'Items'?
            <ListItem
              small
              enableAction={true}
              image={{uri:item.image}}
              title={item.title}
              subtitle={item.category_name}
              location={item.location}
              //phone={item.phone}
              status={item.price}
              style={{ marginBottom: 15 }}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  item: item,
                  type:'item'
                })
              }
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />:null
          )}
        />
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
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderModal()}
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
