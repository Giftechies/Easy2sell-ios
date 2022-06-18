import React, {useLayoutEffect,useState, useEffect} from "react";
import { ScrollView,TextInput, View,Text, I18nManager,TouchableOpacity,ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import { BaseStyle, BaseColor, useTheme, useFont } from "@config"; 
import { ImageBrowser } from 'expo-image-picker-multiple';
import * as ImageManipulator from 'expo-image-manipulator';
import {useTranslation} from 'react-i18next';
import styles from "./styles";
import {
    SafeAreaView,
    Header
} from '@components';

export default function Index({ route,navigation,...props }) {
    const {t} = useTranslation();
    const { onImages, imageCount } = route?.params??{};
    const { colors } = useTheme();
    const [images, setImages] = useState([]);
    const [counting, setCounting] = useState(0);
    const [doneButton, setDoneButton] = useState(() => {});
  const font = useFont();
  const cardColor = colors.card;
  const renderSelectedComponent = (number) => (
    <View style={{paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 50,
      position: 'absolute',
      right: 3,
      bottom: 3,
      justifyContent: 'center',
      backgroundColor: '#000'}}>
      <Text style={{fontWeight: 'bold',
      alignSelf: 'center',
      color: '#ffffff'}}>{number}</Text>
    </View>
  );
  const getHeaderLoader = () => (
    <ActivityIndicator size='small' color={'#0580FF'}/>
  );

  

  const imagesCallback = (callback) => {
    navigation.setOptions({
      headerRight: () => getHeaderLoader()
    });

    callback.then(async (photos) => {
      const cPhotos = [];
      for(let photo of photos) {
        const pPhoto = await processImageAsync(photo.uri);
        cPhotos.push({
          uri: pPhoto.uri,
          name: photo.filename,
          type: 'image/jpg'
        })
      }
      setImages(photos);
      //navigation.navigate('Main', {photos: cPhotos});
    })
    .catch((e) => console.log(e));
  };

  const updateHandler = (count, onSubmit) => {
      setCounting(count);
      setDoneButton(onSubmit)
    // props.navigation.setOptions({
    //   title: `Selected ${count} files`,
    //   headerRight: () => renderDoneButton(count, onSubmit)
    // });

    
      
  };

//   useLayoutEffect(() => {
//       //console.log(counting);
//     navigation.setOptions({
//       title: counting > 0 ? 'Select Images' : 'Selected ${counting} files',
//       headerRight: () => renderDoneButton(counting, doneButton)
//     });
//   }, [navigation, counting]);

  const getImages = ()  => {
    //console.log('go back');
    onImages(images);
    navigation.goBack();
  }

  const renderDoneButton = (count, onSubmit) => {
    if (!counting) return null;
    return <TouchableOpacity title={'Done'} onPress={()=>getImages()}>
      <Text onPress={()=>getImages()}>Done</Text>
    </TouchableOpacity>
  }


  const processImageAsync = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{resize: { width: 800 }}],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };
  const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
  return (
      
    <View style={{flex: 1}}>
    <Header
      title={t('Select Images')}
      renderRight={() => {
        return renderDoneButton(counting, doneButton);
      }}
    />
    
    <ImageBrowser style={{height:"100%"}}
        max={imageCount}
        onChange={updateHandler}
        callback={imagesCallback}
        renderSelectedComponent={renderSelectedComponent}
        emptyStayComponent={emptyStayComponent}
    />
  </View>
      
    // <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
    //     <ScrollView>
    //         <View style={[styles.flex, styles.container]}>
    //             <Text>testing</Text>
    //             <ImageBrowser
    //             max={4}
    //             onChange={updateHandler}
    //             callback={imagesCallback}
    //             renderSelectedComponent={renderSelectedComponent}
    //             emptyStayComponent={"Empty"}
    //             />
    //         </View>
    //     </ScrollView>
    // </SafeAreaView>
      
  );
}

Index.defaultProps = {
  imageCount: 4,
  success: true,
  icon: null,
  placeHolder: "",
  callback: () => {},
  openBrowser: () => {}
};


