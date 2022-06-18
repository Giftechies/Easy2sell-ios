import React, {useState, useRef, useEffect, mem} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import {BaseStyle, Images, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Image, Text, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import { useIsFocused } from "@react-navigation/native";
import {useSelector} from 'react-redux';
import * as api from '@api';
import {
  userSelect
} from '@selectors';

export default function Messages({navigation,route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const isFocused = useIsFocused();
  const refFlatList = useRef(null);
  const user = useSelector(userSelect);
  const [input, setInput] = useState('');
  const [item, setItem] = useState(route?.params?.item)
  const [type, setType] = useState(route?.params?.type)
  const [from_id, setFromId] = useState(route?.params?.from_id)
  const [loading, setLoading] = useState(true);
  const timer = useRef();
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {  
    const params = {
      type: type,
      item_id: item.id,
      from_id: from_id
    };
    getMessages(params);
    setTimeout(() => {
      recieveMessages();
    }, 1000);

  },[]);


  useEffect(() => {  
    timer.current = setInterval(() => {
      recieveMessages();
    }, 1000);

    setTimeout(() => {
      if(refFlatList){
        refFlatList.current.scrollToEnd({animated: false});
      }
    }, 1000);

    return () => {
      clearInterval(timer.current);
    };
  },[messages]);


  const getMessages = async(params) => {
    try {
      const response = await api.getMessages(params);
      if(response.success){
        setLoading(false);
        setMessages(response?.data);
        if(response?.data?.length>0){
          refFlatList.current.scrollToEnd({animated: false});
        }
      }
    } catch (error) {
      const err=error.msg ?? error.data ?? error.code ?? error.message;
      if(err){
        Alert.alert({
          message:  err,
        });
      }  
      //console.log("error");
    }
    setLoading(false);
  }


  const renderItem = mitem => {
    if (user.id == mitem?.to_user?.id) {
      return (
        <View style={styles.userContent}>
          <Image
            source={Images.userIcon}
            style={[styles.avatar, {borderColor: colors.border}]}
          />
          <View style={{paddingHorizontal: 8, flex: 7}}>
            <Text caption1>{mitem?.from_user?.name}</Text>
            <View
              style={[
                styles.userContentMessage,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Text body2 whiteColor>
                {mitem.message}
              </Text>
            </View>
          </View>
          <View style={styles.userContentDate}>
            <Text footnote numberOfLines={1}>
              {mitem.created}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.meContent}>
        <View style={styles.meContentDate}>
          <Text footnote numberOfLines={1}>
            {mitem.created}
          </Text>
        </View>
        <View style={{paddingLeft: 8, flex: 7}}>
          <View
            style={[styles.meContentMessage, {backgroundColor: colors.card}]}>
            <Text body2>{mitem.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  const sendMessage = async() => {
    
    if (input.trim() != '') {
      try {
        let params = {
          type:type,
          item_id:item.id,
          message:input,
          to_id:from_id
        }
        const response = await api.sendMessage(params);
        if(response.success){
          setLoading(false);
          setInput('');
          
        }
      } catch (error) {
        const err=error.msg ?? error.data ?? error.code ?? error.message;
        if(err){
          Alert.alert({
            message:  err,
          });
        }  
        //console.log("error");
      }
    }
  };

  
  const recieveMessages = async() => {
      try {
        let params = {
          item_id:item.id,
          to_id:user.id,
          from_id:from_id,
          type:type,
          id:messages.length?messages[messages.length-1]?.id:0
        }
        const response = await api.receiveMessage(params);
        if(response.success){
          setLoading(false);

          if(response?.data?.length>0){
            setMessages([...messages,...response?.data]);
          
            setInput('');
          }
        }
      } catch (error) {
        console.log(error);
      }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('messages')}
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
      <KeyboardAvoidingView
        style={{flex: 1, justifyContent: 'flex-end'}}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        enabled>
        <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
          <FlatList
          initialNumToRender={200}
            ref={refFlatList}
            data={messages}
            keyExtractor={(item, index) => `message ${index}`}
            renderItem={({item}) => renderItem(item)}
            onContentSizeChange= {()=> setTimeout(() => {refFlatList.current.scrollToEnd()},500)} 
          />
          <View style={styles.inputContent}>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setInput(text)}
                onSubmitEditing={() => sendMessage()}
                placeholder={t('type_message')}
                value={input}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendIcon, {backgroundColor: colors.primary}]}
              onPress={sendMessage}>
              <Icon
                name="paper-plane"
                size={20}
                color="white"
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
