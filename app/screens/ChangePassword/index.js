import React, {useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import {useSelector} from 'react-redux';
import {userSelect} from '@selectors';
import * as api from '@api';
import styles from './styles';

export default function ChangePassword({navigation}) {
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const user = useSelector(userSelect);

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const {colors} = useTheme();
  const [success, setSuccess] = useState({
    password: true,
    repassword: true,
    newpassword:true
  });

  /**
   *
   * On Change Password
   */
  const onChange = async () => {
    if (!password || !repassword || !newpassword || newpassword != repassword) {
      if (newpassword != repassword) {
        Alert.alert({
          title: t('change_password'),
          message: t('confirm_password_not_corrent'),
        });
      }
      setSuccess({
        ...success,
        newpassword:false,
        password: false,
        repassword: false,
      });
      return;
    }
    setLoading(true);
    try {
      const params = {
        password,
        new_password:newpassword,
        api_token:user.token   
      };
      const response = await api.changePassword(params);
      if(response.success){
        Alert.alert({
          type: 'success',
          message: response.msg,
          action: [{onPress: () => navigation.goBack()}],
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
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('change_password')}
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
          style={{flex: 1, justifyContent: 'center'}}
          keyboardVerticalOffset={offsetKeyboard}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              padding: 20,
            }}>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('password')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setPassword(text)}
              secureTextEntry={true}
              placeholder={t('password')}
              autoCapitalize='none'
              autoCorrect={false}
              value={password}
              success={success.password}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('new_password')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setNewPassword(text)}
              secureTextEntry={true}
              placeholder={t('new_password')}
              autoCapitalize='none'
              autoCorrect={false}
              value={newpassword}
              success={success.newpassword}
              onFocus={() => {
                setSuccess({
                  ...success,
                  newpassword: true,
                });
              }}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('re_password')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setRepassword(text)}
              secureTextEntry={true}
              placeholder={t('password_confirm')}
              autoCapitalize='none'
              autoCorrect={false}
              value={repassword}
              success={success.repassword}
              onFocus={() => {
                setSuccess({
                  ...success,
                  repassword: true,
                });
              }}
            />
            <View style={{paddingVertical: 15}}>
              <Button loading={loading} full onPress={onChange}>
                {t('confirm')}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
