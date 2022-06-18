import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert, CheckBox } from 'react-native';
import { BaseStyle, useTheme,Images } from '@config';
import { Header, SafeAreaView, Icon, Button, TextInput,Text,Image } from '@components';
import styles from './styles';
import * as api from '@api';
import { useTranslation } from 'react-i18next';
import SnackBar from 'react-native-snackbar-component';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import * as actionTypes from "@actions/actionTypes";
import { useDispatch, useSelector, } from "react-redux";
import { UserNewModel } from "@models";
import { userSelect } from "@selectors";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


export default function SignUp({ navigation }) {
    const dispatch = useDispatch();
    const user = useSelector(userSelect);
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [location, setLocation] = useState('');
    const [viewtype, setViewtype] = useState('');
    const [locationData, setLocationData] = useState({});
    const offsetKeyboard = Platform.select({
        ios: 0,
        android: 20,
    });

    //useEffect(() => {    
        //dispatch({type:actionTypes.LOGIN_SUCCESS,user:{"name":"Pardeep"}}) 
        //console.log(user);
    //});

   

    const [name, setName] = useState('');
    const [type, setType] = useState('User');
    const [otp, setOtp] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(0);
    const [emailormobile, setEmailOrMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingB, setLoadingB] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [success, setSuccess] = useState({
        name: true,
        password: true,
        emailormobile: true,
        location:true,
        otp:true
    });

    useEffect(() => {
        if (btnDisabled > 0) {
          setTimeout(() => setBtnDisabled(btnDisabled - 1), 1000);
        } else {
            //setBtnDisabled(0);
        }
    });

    const notify = (message) => {
        setSnackVisible(true);
        setSnackMessage(message);
        Keyboard.dismiss();
        setTimeout(()=>{console.log(snackVisible);setSnackVisible(false)}, 2000);
    }

    /**
     * call when action signup
     *
     */
    const onSignUp = async() => {
        if (name == '' || emailormobile == '' || location == '' || password == '') {
            setSuccess({
                ...success,
                name: name != '' ? true : false,
                emailormobile: emailormobile != '' ? true : false,
                password: password != '' ? true : false,
                location: location != '' ? true : false,
            });
        } else {
            setLoading(true);
            try {
                const params = {
                    name,
                    password,
                    type,
                    emailormobile,
                    location,
                    locationData:JSON.stringify(locationData)
                };
                const response = await api.signUp(params);
                if(response.success){
                    Alert.alert({
                        type: 'success',
                        message: response.msg,
                        action: [{ onPress: () => { 
                            //navigation.goBack() 
                            const user = new UserNewModel(response.user);
                            //console.log(user);
                            dispatch({type:actionTypes.LOGIN_SUCCESS,user:user})
                            //console.log(response.user);
                            navigation.goBack() 
                        } }],
                    });
                    setLocation('');
                    setLocationData({});
                }else{
                    Alert.alert({
                        message: response?.data?.error ?? response.error ,
                    });
                }
                
            } catch (error) {
                Alert.alert({
                    message: error?.data?.error ?? error.data ?? error.code ?? error.message ?? error.msg,
                });
            }
            setLoading(false);
        }
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

    /**
     * call when action otpSend
     *
     */
    const sendOtp = async() => {
        if (emailormobile == '') {
            setSuccess({
                ...success,
                emailormobile: emailormobile != '' ? true : false
            });
        } else {
            if(otpSent){
                setLoadingB(true);
            }else{
                setLoading(true);
            }

            try {
                const params = {
                    emailormobile,
                };
                const response = await api.sendOtp(params);
                if(response.success){
                    notify(response.msg);
                    setOtpSent(true);
                    setBtnDisabled(60)
                }else{
                    Alert.alert({
                        message: response?.data?.error ?? response.error ,
                    });
                }
                
            } catch (error) {
                Alert.alert({
                    message: error.data ?? error.code ?? error.message ?? error.msg,
                });
            }
            if(otpSent){
                setLoadingB(false);
            }else{
                setLoading(false);
            }
            //setLoading(false);
        }
    };

    const verifyOtp = async() => {
        if (emailormobile == '' || otp == '') {
            setSuccess({
                ...success,
                emailormobile: emailormobile != '' ? true : false,
                otp: otp != '' ? true : false
            });
        } else {
            setLoading(true);
            try {
                const params = {
                    emailormobile,
                    otp
                };
                const response = await api.verifyOtp(params);
                if(response.success){
                    notify(response.msg);
                    setOtpVerified(true);
                }else{
                    Alert.alert({
                        message: response?.data?.error ?? response?.error ,
                    });
                }
                
            } catch (error) {
                Alert.alert({
                    message: error.data ?? error.code ?? error.message ?? error.msg,
                });
            }
            setLoading(false);
        }
    };

    // const displayFields = () => {
        
    // }
    if(viewtype=='map'){
        return renderLocation();
    }else{
        return (
            <View style={{flex: 1}}>
                <Header
                title={t('sign_up')}
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
                    <View style={styles.contain}>
                        <View style={styles.wrapper}>
                            {/* <SvgCssUri uri={resolveAssetSource(Images.logo1).uri} style={styles.logo} width="200" height="80" resizeMode="contain" /> */}
                            <Image
            style={styles.logo}
            resizeMode="contain"
            source={Images.logo}
          />
                            <Text title2 primaryColor style={{marginBottom:20}}>
                            Sign Up Now
                            </Text>
                            <Text grayColor style={{textAlign:"center",marginBottom:20}}>
                Please fill your email and create account.
              </Text>
                        </View>
                    {(otpVerified) &&
                        <>
                            <TextInput
                                onChangeText={text => setName(text)}
                                placeholder={t('Name')}
                                success={success.name}
                                value={name}
                                onFocus={() => {
                                    setSuccess({
                                        ...success,
                                        name: true,
                                    });
                                }}
                            />
                            <TextInput
                                style={{marginTop: 10}}
                                onChangeText={text => setEmailOrMobile(text)}
                                placeholder={t('email')}
                                autoCapitalize = 'none'
                                autoCorrect={false}
                                //keyboardType="email-address"
                                success={success.emailormobile}
                                editable = {false}
                                value={emailormobile}
                                onFocus={() => {
                                setSuccess({
                                    ...success,
                                    emailormobile: true,
                                });
                                }}
                            />
                            <TextInput
                                style={{marginTop: 10}}
                                onChangeText={text => setPassword(text)}
                                secureTextEntry={true}
                                placeholder={t('Password')}
                                keyboardType={"visible-password"}
                                autoCapitalize = 'none'
                                autoCorrect={false}
                                success={success.password}
                                value={password}
                                onFocus={() => {
                                setSuccess({
                                    ...success,
                                    password: true,
                                });
                                }}
                            />
                            <View style={{display:'flex',justifyContent:'flex-start',width:'100%'}}>
                                <Text style={{marginTop: 10}}>Register as</Text>
                                <View style={{marginTop: 10, display:'flex',flexDirection:'row', justifyContent:'flex-start', alignItems: "center"}}>
                                    <TouchableOpacity style={styles.checkboxContainer} onPress={()=>setType('Seller')}>
                                        <CheckBox
                                            value={type == 'Seller'?true:false}
                                            style={styles.checkbox}
                                        />
                                        <Text style={styles.label}>Seller</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.checkboxContainer} onPress={()=>setType('User')}>
                                        <CheckBox
                                            value={type == 'User'?true:false}
                                            style={styles.checkbox}
                                        />
                                        <Text style={styles.label}>User</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{display:'flex',justifyContent:'flex-start',width:'100%'}}>
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
                            <Button
                                full
                                style={{marginTop: 20}}
                                loading={loading}
                                onPress={() => onSignUp()}>
                                {t('sign_up')}
                            </Button>
                        </>
        }
        {(!otpVerified) &&
                        <>
                            <TextInput
                                style={{marginTop: 10}}
                                onChangeText={text => setEmailOrMobile(text)}
                                placeholder={t('email')}
                                autoCapitalize = 'none'
                                autoCorrect={false}
                                //keyboardType="email-address"
                                success={success.emailormobile}
                                value={emailormobile}
                                onFocus={() => {
                                    setSuccess({
                                        ...success,
                                        emailormobile: true,
                                    });
                                }}
                            />
                            {(otpSent) && <>
                                <TextInput
                                    style={{marginTop: 10}}
                                    onChangeText={text => setOtp(text)}
                                    placeholder={t('OTP')}
                                    //keyboardType="email-address"
                                    success={success.otp}
                                    value={otp}
                                    onFocus={() => {
                                        setSuccess({
                                            ...success,
                                            otp: true,
                                        });
                                    }}
                                />

                                <Button
                                    full
                                    style={{marginTop: 20}}
                                    loading={loading}
                                    onPress={() => verifyOtp()}>
                                    {t('verify_otp')}
                                </Button>
                                
                                <Button
                                    disabled={btnDisabled}
                                    full
                                    style={{marginTop: 20,opacity:btnDisabled==0?1:0.5}}
                                    loading={loadingB}
                                    onPress={() => sendOtp()}>
                                    {t('resend_otp')} {btnDisabled>0 && '('+btnDisabled+')'}
                                </Button>
                            </>
                            }
                            {(!otpSent) && 
                            <Button
                                full
                                style={{marginTop: 20}}
                                loading={loading}
                                onPress={() => sendOtp()}>
                                {t('send_otp')}
                            </Button>
                            }
                        </>
                    }
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={{display:'flex',alignItems:'center',width:'100%',marginTop:20}}>
                        <Text body1 grayColor>
                            {t('already_have_account')} <Text primaryColor>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        );
    }
}