import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import * as api from '@api';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
} from '@components';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {authActions} from '@actions';
import {userSelect} from '@selectors';

export default function NotificationPreference({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(userSelect);

  const [loading, setLoading] = useState(false);
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [constructionCategories, setConstructionCategories] = useState([]);
  const [itemCategories, setItemCategories] = useState([]);
  const [couponCategories, setCouponCategories] = useState([]);
  
  const [selectedVehicleCategories, setSelectedVehicleCategories] = useState([]);
  const [selectedJobCategories, setSelectedJobCategories] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedConstructionCategories, setSelectedConstructionCategories] = useState([]);
  const [selectedItemCategories, setSelectedItemCategories] = useState([]);
  const [selectedCouponCategories, setSelectedCouponCategories] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]);

  useEffect(() => {  
    getFields();
  },[]);

  useEffect(() => {  
    const vcats = vehicleCategories.filter((item)=>{ return userPreferences?.vehicle_categories?.includes(item.id.toString())})
    setSelectedVehicleCategories(vcats);

    const jcats = jobCategories.filter((item)=>{ return userPreferences?.job_categories?.includes(item.id.toString())})
    setSelectedJobCategories(jcats);
    const itemcats = [];
    itemCategories.map((item)=>{ 
      if(item?.children.length>0){ 
        item?.children?.forEach(itemnew=> { if(userPreferences?.item_categories?.includes(itemnew.id.toString())) itemcats.push(itemnew);} );
      }
    })
    setSelectedItemCategories(itemcats);

    const ccats = couponCategories.filter((item)=>{  return userPreferences?.coupon_categories?.includes(item.id.toString())})
    setSelectedCouponCategories(ccats);

    const constcats = constructionCategories.filter((item)=>{ return userPreferences?.construction_categories?.includes(item.id.toString())})
    setSelectedConstructionCategories(constcats);
    
    const ptypes = propertyTypes.filter((item)=>{ return userPreferences?.property_types?.includes(item)})
    setSelectedPropertyTypes(ptypes);

  },[userPreferences]);

  const getFields = async(params={}) => {
    setLoading(true);
    try {
      const response = await api.getPreferenceFields(params);
      if(response.success){
        setPropertyTypes(response.data.property_type);
        setVehicleCategories(response.data.vehicleCategories);
        setJobCategories(response.data.jobCategories);
        setConstructionCategories(response.data.constructionCategories);
        setItemCategories(response.data.itemCategories);
        setCouponCategories(response.data.couponCategories);
        setUserPreferences(response.data?.preferences);
        
      }else{
        Alert.alert({
            message: response?.data?.error ?? response.error
        });
      }
    } catch (error) {
      const err=error.msg ?? error.data ?? error.code ?? error.message;
        if(err){
          Alert.alert({
            message:  err,
          });
        }  
    }
    setLoading(false);
  }
  
  const onSelectVCats = (categories,title=null) => {
    setSelectedVehicleCategories(categories);
    const params = {
        vehicle_categories: categories.map(a => a.id).join(',')
    };
    savePreference(params);
  };
  const onSelectPTypes = (categories,title=null) => {
    setSelectedPropertyTypes(categories);
    const params = {
        property_types: categories.join(',')
    };
    savePreference(params);
  };
  const onSelectJCats = (categories,title=null) => {
    setSelectedJobCategories(categories);
    const params = {
        job_categories: categories.map(a => a.id).join(',')
    };
    savePreference(params);
  };
  const onSelectCCats = (categories,title=null) => {
    setSelectedCouponCategories(categories);
    const params = {
        coupon_categories: categories.map(a => a.id).join(',')
    };
    savePreference(params);
  };
  const onSelectConstCats = (categories,title=null) => {
    setSelectedConstructionCategories(categories);
    const params = {
        construction_categories: categories.map(a => a.id).join(',')
    };
    savePreference(params);
  };
  const onSelectICats = (categories,title=null) => {
    setSelectedItemCategories(categories);
    const params = {
        item_categories: categories.map(a => a.id).join(',')
    };
    savePreference(params);
  };

  const savePreference = async(params) => {
    setLoading(true);
    try {
      const response = await api.savePreference(params);
      if(response.success){
        Alert.alert({
            type: 'success',
            message: response.msg,
        });
      }else{
        Alert.alert({
          message: response?.data?.error ?? response.error
      });
      }
    } catch (error) {
      const err=error.msg ?? error.data ?? error.code ?? error.message;
      if(err){
        Alert.alert({
          message:  err,
        });
      }  
    }
    setLoading(false);
  }


  return (
    <View style={{flex: 1}}>
      <Header
        title={t('notification_preference')}
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
        <ScrollView>
          <View style={styles.contain}>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('CommonMultiSelectModel',{categories:vehicleCategories,onSelect:onSelectVCats});
              }}>
              <Text body1>Vehicle Categories</Text>
              <Text style={{ flex:1,textAlign:'right' }} grayColor numberOfLines={1}>{selectedVehicleCategories.length>0? 
                    vehicleCategories.map((item,index) => {if(index<2){ return  (index ? ', ': '') + item.name }})
                    :'All'}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('CommonMultiSelectModelB',{categories:propertyTypes,onSelect:onSelectPTypes});
              }}>
              <Text body1>Real Estate Type</Text>
              <Text style={{ flex:1,textAlign:'right' }} grayColor numberOfLines={1}>{selectedPropertyTypes.length>0? 
                    selectedPropertyTypes.map((item,index) => {if(index<2){ return  (index ? ', ': '') + item }})
                    :'All'}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('CommonMultiSelectModel',{categories:constructionCategories,onSelect:onSelectConstCats});
              }}>
              <Text body1>Construction Categories</Text>
              
              <Text style={{ flex:1,textAlign:'right' }} grayColor numberOfLines={1}>{selectedConstructionCategories.length>0? 
                    selectedConstructionCategories.map((item,index) => {if(index<2){ return  (index ? ', ': '') + item.name }})
                    :'All'}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('CommonMultiSelectModel',{categories:itemCategories,onSelect:onSelectICats});
              }}>
              <Text body1>Items Categories</Text>
              <Text style={{ flex:1,textAlign:'right' }} grayColor numberOfLines={1}>{selectedItemCategories.length>0? 
                    selectedItemCategories.map((item,index) => {if(index<2){ return  (index ? ', ': '') + item.name }})
                    :'All'}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('CommonMultiSelectModel',{categories:jobCategories,onSelect:onSelectJCats});
              }}>
              <Text body1>Job Categories</Text>
              <Text style={{ flex:1,textAlign:'right' }} grayColor numberOfLines={1}>{selectedJobCategories.length>0? 
                    selectedJobCategories.map((item,index) => {if(index<2){ return  (index ? ', ': '') + item.name }})
                    :'All'}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('CommonMultiSelectModel',{categories:couponCategories,onSelect:onSelectCCats});
              }}>
              <Text body1>Coupon Categories</Text>
              <Text style={{ flex:1,textAlign:'right' }} grayColor numberOfLines={1}>{selectedCouponCategories.length>0? 
                    selectedCouponCategories.map((item,index) => {if(index<2){ return  (index ? ', ': '') + item.name }})
                    :'All'}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button full loading={loading} onPress={onLogout}>
            {t('sign_out')}
          </Button>
        </View> */}
      </SafeAreaView>
    </View>
  );
}
