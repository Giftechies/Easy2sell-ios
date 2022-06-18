import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import {BaseStyle, useTheme, Images} from '@config';
import {Header, SafeAreaView, Icon, Text,Image, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {authActions} from '@actions';
import {designSelect} from '@selectors';

export default function SignIn({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const design = useSelector(designSelect);

  const [loading, setLoading] = useState(false);
  const [emailormobile, setId] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState({emailormobile: true, password: true});

  /**
   * call when action onLogin
   */
  const onLogin = () => {
    if (emailormobile == '' || password == '') {
      setSuccess({
        ...success,
        emailormobile: false,
        password: false,
      });
      return;
    }
    const params = {
      emailormobile,
      password,
    };
    setLoading(true);
    dispatch(
      authActions.onLogin(params, design, response => {
        //console.log(response);
        if (response?.success) {
          navigation.goBack();
          setTimeout(() => {
            route.params?.success?.();
          }, 1000);
          return;
        }
        Alert.alert({message: t(response?.data?.error ?? response?.error)});
        setLoading(false);
      }),
    );
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('sign_in')}
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
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={Images.logo}
          />
          {/* <SvgCssUri uri={resolveAssetSource(Images.logo1).uri} style={styles.logo} width="200" height="80" resizeMode="contain" /> */}
            <Text title2 primaryColor style={{marginBottom:20}}>
              Log in Now
            </Text>
            <Text grayColor style={{textAlign:"center",marginBottom:20}}>
                Please login to continue using our app.
              </Text>
          </View>
            <TextInput
              onChangeText={setId}
              onFocus={() => {
                setSuccess({
                  ...success,
                  id: true,
                });
              }}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder={t('email')}
              success={success.emailormobile}
              value={emailormobile}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={setPassword}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder={t('password')}
              secureTextEntry={true}
              success={success.password}
              value={password}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')} style={{display:'flex',alignItems:'flex-end',width:'100%'}}>
              <Text body1 grayColor style={{marginTop: 10}}>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>
            <Button
              style={{marginTop: 10}}
              full
              loading={loading}
              onPress={onLogin}>
              {t('sign_in')}
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{display:'flex',alignItems:'center',width:'100%',marginTop:10}}>
              <Text body1 grayColor>
                {t('not_have_account')} <Text primaryColor>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
