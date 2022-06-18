import React, {useState, useEffect} from 'react';
import * as api from '@api';
import {View, ScrollView, ImageBackground, KeyboardAvoidingView, Platform, Alert,TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle,BaseColor, Images, useTheme} from '@config';
import {useDispatch, useSelector} from 'react-redux';
import {userSelect} from '@selectors';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button, 
  TextInput,
  Image,
  AddImageArea
} from '@components';
import styles from '../styles';

export default function EditCoupon({navigation,route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const user = useSelector(userSelect);
  //const [formFields, setFormFields] = useState([]);
  const [brandLogo, setBrandLogo] = useState([]);
  const [item, setItem] = useState(route.params?.item ?? null);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const [selectedType, setSelectedType] = useState({});
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState({});
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [referralUrl, setReferralUrl] = useState('');
  const [expiryDate, setExpiryDate] = useState(moment().format("DD-MM-YYYY"));
  const [startDate, setStartDate] = useState(moment().format("DD-MM-YYYY"));
  const [loading, setLoading] = useState(false);
  
  const [success, setSuccess] = useState({
      title: true,
      brandLogo:true,
      code:true,
      type:true,
      category:true,
      referralUrl:true,
      expiryDate:true,
      startDate:true,
      description:true,
  });

  useEffect(() => {  
    const params = {
      form_type:'coupon'
    };
    getCoupontype(params);
    const param = {
      type:'coupon',
      id:item?.id
    };
    getPostToEdit(param);
  },[]);

  useEffect(() => {  
    if(selectedType?.name){
    setType(selectedType.name);
    }
  },[selectedType]);

  useEffect(() => {  
    if(selectedCategory?.name){
    setCategory(selectedCategory.name);
    }
  },[selectedCategory]);

  const onSelect = (category,title=null) => {
    if(title=='select_type'){
      setSelectedType(category);
    }
    else{
      setSelectedCategory(category);
    }
  };

  

  const getPostToEdit = async (params) => {
    try {
      const response = await api.getPostToEdit(params);
      if(response.success){
        setItem(response.data);
        setTitle(response.data.title);
        setCode(response.data.code);
        setCategory(response.data.category.name);
        setSelectedCategory(response.data.category);
        setSelectedType(response.data.type);
        setType(response.data.type.name);
        setReferralUrl(response.data.referral_url);
        setDescription(response.data.description);
        setStartDate(response.data.start_date);
        setExpiryDate(response.data.expiry_date);
      }
    } catch (error) {
      const err=error.msg ?? error.data ?? error.code ?? error.message;
      if(err){
        Alert.alert({
          message:  err,
        });
      }  
    }
  }


  const onImages = images => {
    //console.log(data);
    //console.log(images);
    setBrandLogo(images);
    
  };

  const createPost = async () => {
    if (title == '' || category == '' || brandLogo.length==0 && item && item.brandImage=="" || code == '' && type=='coupon' || type == '' || referralUrl == '' || startDate == '' || expiryDate == '' || description == '') {
      setSuccess({
          ...success,
          title: title != '' ? true : false,
          brandLogo: brandLogo.length > 0 && item && item.brandImage!="" ? true : false,
          // tags: tags.tagsArray.length > 0 ? true : false,
          type: type != '' ? true : false,
          category: category != '' ? true : false,
          referralUrl: referralUrl != '' ? true : false,
          code: code != '' && type!='coupon' ? true : false,
          startDate: startDate != '' ? true : false,
          expiryDate: expiryDate != '' ? true : false,
          description: description != '' ? true : false,
      });
      //console.log(success);
    }else{
      // Alert.alert({
      //   title: t('create_post'),
      //     message:  JSON.parse(selectedCondition),
      // });
      // return false;
      if(!user){
        Alert.alert({
            message:  'You dont have permission please login.',
        });
        return false;
      }
      setLoading(true);
      let formdata = new FormData();
      for (let image of brandLogo) {
        formdata.append('brand_logo',{uri: image.uri, name: image.filename, type: 'image/jpg'})
      }
      
      formdata.append('title',title);
      formdata.append('id',item.id);
      formdata.append('code',code);
      formdata.append('referral_url',referralUrl);
      formdata.append('category_id',selectedCategory.id);
      formdata.append('api_token',user.token);
      formdata.append('start_date',startDate);
      formdata.append('expiry_date',expiryDate);
      formdata.append('type',selectedType.name);
      formdata.append('description',description);
      try {
          const response = await api.editCoupon(formdata,{
            'Content-Type': 'multipart/form-data'
          });
          if(response.success){
            //console.log(response.data);
            Alert.alert({
                type: 'success',
                message: response.msg,
                action: [{ onPress: () => { 
                  } 
                }],
            });
          }else{
              Alert.alert({
                  message: response?.data?.error ?? response.error ,
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
  }

  const getCoupontype = async(params) => {
    try {
      const response = await api.getFormFields(params);
      if(response.success){
        setTypes(response.data.coupontype);
        setCategories(response.data.categories);
      }
    } catch (error) {
      const err=error.msg ?? error.data ?? error.code ?? error.message;
      if(err){
        Alert.alert({
          message:  err,
        });
      }  
    }
  }
  

  const openImageBrowser = () => {
    // console.log('open');
    navigation.navigate('ImageBrowser',{imageCount: 1, onImages:onImages})
  }

  
  return (
    <View style={{flex: 1}}>
      <Header
        title={t('edit_coupon')}
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
        
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            keyboardVerticalOffset={offsetKeyboard}
            style={{flex: 1}}>
        <ScrollView>
            
            <View style={styles.contain}>
              
              <AddImageArea 
                openBrowser={()=>openImageBrowser()}
                placeholder={t('Add Images')}
                success={success.brandLogo}
              />
              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
              {item && item.brandImage && brandLogo.length==0 && <Image style={{height: 50, width: 50, borderWidth: 2, backgroundColor:"#eaeaea", borderColor:"#333"}} key='oldimage' source={{uri:item.brandImage}} resizeMode="contain" />}
              {
                  brandLogo.map((img,index) => {
                    return <Image style={{height: 50, width: 50, borderWidth: 2, backgroundColor:"#eaeaea", borderColor:"#333"}} key={index} source={{uri:img.uri}} resizeMode="contain" />
                  })
                }
              </View>
              <Text body2 style={{marginTop: 5,color:BaseColor.grayColor}}>
                Choose a brand logo
              </Text>
              <TextInput
                  style={{marginTop: 10}}
                  onChangeText={text => setTitle(text)}
                  placeholder={t('Title')}
                  success={success.title}
                  value={title}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          name: true,
                      });
                  }}
              />
              <TextInput
                  style={{marginTop: 10}}
                  onChangeText={text => setCode(text)}
                  placeholder={t('code')}
                  success={success.code}
                  value={code}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          code: true,
                      });
                  }}
              />

                <TouchableOpacity
                  style={[
                    styles.profileItem,
                  ]}
                  onPress={() => {
                    navigation.navigate('CommonSelectModel',{categories,onSelect:onSelect});
                  }}>
                  <Text style={{color:!success.category?colors.primary:colors.gray}}>{t('category')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text grayColor>
                      {category}
                    </Text>
                    <Icon
                      name="angle-right"
                      size={18}
                      color={colors.primary}
                      style={{marginLeft: 5}}
                      enableRTL={true}
                    />
                  </View>
                </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.profileItem,
                ]}
                onPress={() => {
                  navigation.navigate('CommonSelectModelB',{categories:types,title:'select_type',onSelect:onSelect});
                }}>
                <Text style={{color:!success.type?colors.primary:colors.gray}}>{t('coupon_type')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text grayColor>
                    {type}
                  </Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{marginLeft: 5}}
                    enableRTL={true}
                  />
                </View>
              </TouchableOpacity>

              <TextInput
                  style={{marginTop: 10}}
                  onChangeText={text => setReferralUrl(text)}
                  placeholder={t('Referral Url')}
                  success={success.referralUrl}
                  value={referralUrl}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          referralUrl: true,
                      });
                  }}
              />     
              
              <DatePicker
                style={{marginTop: 10, height:'auto', textAlignVertical: 'top',justifyContent: 'flex-start', width: '100%'}}
                date={startDate} //initial date from state
                mode="date" //The enum of date, datetime and time
                placeholder="Select Start Date"
                format="DD-MM-YYYY"
                minDate="01-01-2016"
                maxDate="01-01-2030"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                    dateIcon: {
                    //display: 'none',
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                    },
                    dateInput: {
                    marginLeft: 36,
                    },
                }}
                onDateChange={(date) => {
                    setStartDate(date);
                }}
            />

            <DatePicker
                style={{marginTop: 10, height:'auto', textAlignVertical: 'top',justifyContent: 'flex-start', width: '100%'}}
                date={expiryDate} //initial date from state
                mode="date" //The enum of date, datetime and time
                placeholder="Select Expiry Date"
                format="DD-MM-YYYY"
                minDate="01-01-2016"
                maxDate="01-01-2030"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                    dateIcon: {
                    //display: 'none',
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                    },
                    dateInput: {
                    marginLeft: 36,
                    },
                }}
                onDateChange={(date) => {
                    setExpiryDate(date);
                }}
            />
              
              <TextInput
                  style={{marginTop: 10, height:100, textAlignVertical: 'top',justifyContent: 'flex-start',}}
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={text => setDescription(text)}
                  placeholder={t('description')}
                  success={success.description}
                  value={description}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          description: true,
                      });
                  }}
              />
              
              <Button
                  full
                  style={{marginTop: 20}}
                  loading={loading}
                  onPress={() => createPost()}>
                  {t('update_post')}
              </Button>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
  );
}
