import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';
import styles from './styles';
import {userSelect} from '@selectors';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import * as actionTypes from "@actions/actionTypes";
import { TouchableOpacity } from 'react-native-gesture-handler';
import {authActions} from '@actions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function ProfileEdit({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(userSelect);
  const [location, setLocation] = useState('');
  const [viewtype, setViewtype] = useState('');
  const [locationData, setLocationData] = useState({});
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.mobile);
  //const [information, setInformation] = useState(user.description);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    mobile: true,
    location:true
  });

  useEffect(()=>{
    let data={};
    let terms=[];
    let geometry=[];
    if(user.city && user.city!=''){
      terms[0]={value:user.city};
    }
    if(user.state && user.state!=''){
      terms[1]={value:user.state};
    }
    if(user.country && user.country!=''){
      terms[2]={value:user.country};
    }
    data.terms=terms;


    if(user.latitude!='' && user.longitude!=''){
      geometry = {
        location:{
          lat:user.latitude,
          lng:user.longitude,
        }
      }
    }
    data.geometry=geometry;
    setLocation(user.location);
    setLocationData(data);
  },[user])

  /**
   * on Update Profile
   *
   */
  const onUpdate = () => {
    if (name == '' || email == '' || location == '' || mobile == '') {
      setSuccess({
        ...success,
        name: name != '' ? true : false,
        email: email != '' ? true : false,
        location: location != '' ? true : false,
        mobile: mobile != '' ? true : false
      });
      return false;
    }
    const params = {
      name,
      email,
      mobile,
      location,
      locationData:JSON.stringify(locationData),
      api_token:user.token   
    };
    
    setLoading(true);
    dispatch(
      authActions.onEditProfile(params, response => {
        if(response.success){
          Alert.alert({
            type: 'success',
            message: response.msg,
            action: [{onPress: () => {
                navigation.goBack()
              }
            }],
          });
        }else{
          Alert.alert({
              message: response?.data?.error ?? response?.error ,
          });
        }
          setLoading(false);
      }),
    );
  };
  const renderLocation = () => {
    return (
        <View style={styles.autocomplete}>
        <GooglePlacesAutocomplete
            GooglePlacesDetailsQuery={{ fields: "geometry" }}
            fetchDetails={true}
            placeholder="Search"
            query={{
            key: "AIzaSyCnZAFX7HA9pil0wpoZRVWm7f4vigQJKgw",
            language: 'en',
            components:'country:ca'
            }}
            onPress={(data, details = null) => { data.geometry=details?.geometry; setLocation(data.description);setLocationData(data);setViewtype('');}}
            onFail={(error) => console.error(error)}
            requestUrl={{
            url:
                'https://maps.googleapis.com/maps/api',
            useOnPlatform: 'web',
            }} // this in only required for use on the web. See https://git.io/JflFv more for details.
        />
        <TouchableOpacity onPress={() => setViewtype('')} style={{marginLeft: 5,height:45,display:'flex',padding:10}}>
        <Icon
            name="times"
            size={20}
            color={colors.primary}
            enableRTL={true}
        />
        </TouchableOpacity>
        </View>
    );
  };

  if(viewtype=='map'){
    return renderLocation();
  }else{
    return (
      <View style={{flex: 1}}>
        <Header
          title={t('edit_profile')}
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            keyboardVerticalOffset={offsetKeyboard}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.contain}>
              <Image source={user.image} style={styles.thumb} />
              <View style={styles.contentTitle}>
                <Text headline semibold>
                  {t('name')}
                </Text>
              </View>
              <TextInput
                onChangeText={text => setName(text)}
                placeholder={t('name')}
                value={name}
                success={success.name}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    username: true,
                  });
                }}
              />
              <View style={styles.contentTitle}>
                <Text headline semibold>
                  {t('email')}
                </Text>
              </View>
              <TextInput
                onChangeText={text => setEmail(text)}
                placeholder={t('email')}
                value={email}
                success={success.email}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    email: true,
                  });
                }}
              />
              <View style={styles.contentTitle}>
                <Text headline semibold>
                  {t('mobile')}
                </Text>
              </View>
              <TextInput
                onChangeText={text => setMobile(text)}
                placeholder={t('mobile')}
                value={mobile}
                success={success.mobile}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    mobile: true,
                  });
                }}
              />
              <View style={{display:'flex',justifyContent:'flex-start',width:'100%'}}>
                <View style={styles.contentTitle}>
                  <Text headline semibold>
                    {t('location')}
                  </Text>
                </View>
                <TouchableOpacity
                    style={[
                    styles.profileItem,
                    ]}
                    onPress={() => setViewtype('map')}>
                    <Text style={{color:!success.location?colors.primary:colors.gray}}>{t('location')}</Text>
                    <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Text numberOfLines={1} style={{ width: 150 }} grayColor>
                        {location}
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
              </View>
            </ScrollView>
            <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
              <Button loading={loading} full onPress={onUpdate}>
                {t('confirm')}
              </Button>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
}
