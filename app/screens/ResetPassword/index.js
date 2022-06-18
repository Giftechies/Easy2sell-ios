import React, {useState,useEffect} from 'react';
import { View, KeyboardAvoidingView, Platform, Alert } from 'react-native';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import {BaseStyle, useTheme,Images} from '@config';
import styles from './styles';
import SnackBar from 'react-native-snackbar-component'
import * as api from '@api';
import {Header, SafeAreaView, Icon, TextInput, Button,Image,Text} from '@components';
import {useTranslation} from 'react-i18next';

export default function ResetPassword({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [btnDisabled, setBtnDisabled] = useState(0);
  const [otp, setOtp] = useState('');
  const [emailormobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [success, setSuccess] = useState({
      password: true,
      emailormobile: true,
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
    setTimeout(()=>{setSnackVisible(false)}, 2000);
}
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
              const response = await api.sendResetOtp(params);
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
              const response = await api.verifyResetOtp(params);
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

  /**
   * call when action reset pass
   */
  const onReset = async() => {
    if (emailormobile == '' || password == '') {
        setSuccess({
            ...success,
            emailormobile: emailormobile != '' ? true : false,
            password: password != '' ? true : false,
        });
    } else {
        setLoading(true);
        try {
            const params = {
                password,
                emailormobile,
            };
            const response = await api.resetPassword(params);
            if(response.success){
                Alert.alert({
                    type: 'success',
                    message: response.msg,
                    action: [{ onPress: () => { 
                      navigation.navigate('SignIn');
                    } }],
                });
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

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('reset_password')}
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
                Reset Password
                </Text>
            </View>
            {(otpVerified) &&
                <>
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
                    
                    <Button
                        full
                        style={{marginTop: 20}}
                        loading={loading}
                        onPress={() => onReset()}>
                        {t('reset_password')}
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
            </View>
          {/* <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              onChangeText={text => seteEmail(text)}
              autoCapitalize='none'
              autoCorrect={false}
              onFocus={() => {
                setSuccess({
                  ...success,
                  email: true,
                });
              }}
              placeholder={t('email_address')}
              success={success.email}
              value={email}
              selectionColor={colors.primary}
            />
            <Button
              style={{marginTop: 20}}
              full
              onPress={() => {
                onReset();
              }}
              loading={loading}>
              {t('reset_password')}
            </Button>
          </View> */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
