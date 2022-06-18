import React, {useState,useEffect} from 'react';
import {View, ScrollView, ImageBackground, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle, Images, useTheme} from '@config';
import HTML from "react-native-render-html";
import * as Utils from "@utils";
import * as api from '@api';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
} from '@components';
import styles from './styles';

export default function AboutUs({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [about, setAbout] = useState(null);
  const [ourTeam] = useState([
    {
      id: '1',
      screen: 'Profile1',
      image: Images.profile2,
      subName: 'CEO Founder',
      name: 'Kondo Ieyasu',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '2',
      screen: 'Profile2',
      image: Images.profile3,
      subName: 'Sale Manager',
      name: 'Yeray Rosales',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '3',
      screen: 'Profile3',
      image: Images.profile5,
      subName: 'Product Manager',
      name: 'Alf Huncoot',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '4',
      screen: 'Profile4',
      image: Images.profile4,
      subName: 'Designer UI/UX',
      name: 'Chioke Okonkwo',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
  ]);

  useEffect(()=>{
    getAbout();
  })

  const getAbout = async() => {
    const response = await api.about(null);
    if(response.success){
      setAbout(response.data);
    }
  }

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('about_us')}
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
        {about && <ScrollView style={{flex: 1}}>
          <ImageBackground source={{uri:about.image}} style={styles.banner}>
            <Text title1 semibold whiteColor>
              {about.title}
            </Text>
            {/* <Text subhead whiteColor>
              {t('sologan_about_us')}
            </Text> */}
          </ImageBackground>
          <View style={styles.content}>
            {/* <Text headline semibold>
              {t('who_we_are').toUpperCase()}
            </Text> */}
            <HTML source={{html: about.description}}/>
            
          </View>
          
        </ScrollView>}
        
      </SafeAreaView>
    </View>
  );
}
