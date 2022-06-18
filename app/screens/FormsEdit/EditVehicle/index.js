import React, {useState, useEffect} from 'react';
import * as api from '@api';
import {View, ScrollView, ImageBackground, KeyboardAvoidingView, Platform, Alert,TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle,BaseColor, Images, useTheme} from '@config';
import {useDispatch, useSelector} from 'react-redux';
import {userSelect} from '@selectors';
import TagInput from 'react-native-tags-input';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
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

export default function EditVehicle({navigation,route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const user = useSelector(userSelect);
  const [oldImages, setOldImages] = useState([]);
  //const [formFields, setFormFields] = useState([]);
  const [images, setImages] = useState([]);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [title, setTitle] = useState('');
  const [item, setItem] = useState(route.params?.item ?? null);
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState({});
  const [viewtype, setViewtype] = useState('');
  
  const [tags, setTags] = useState({
    tag: '',
    tagsArray: []
  });
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [success, setSuccess] = useState({
      title: true,
      images:true,
      price:true,
      category:true,
      tags:true,
      images:true,
      location:true,
      description:true,
      tags:true
  });

  useEffect(() => {  
    const params = {
      form_type:'vehicle'
    };
    getCategories(params);
    const param = {
      type:'vehicle',
      id:item?.id
    };
    getPostToEdit(param);
  },[]);

  
  const getPostToEdit = async (params) => {
    try {
      const response = await api.getPostToEdit(params);
      if(response.success){
        setItem(response.data);
        setTitle(response.data.title);
        setPrice(response.data.price);
        setDescription(response.data.description);
        setSelectedCategory(response.data.category);
        setTags({tag:'',tagsArray:response.data.tagsArray})
        setCategory(response.data.category.name);
        setLocation(response.data.location);
        setLocationData(response.data.locationdata);
        setOldImages(response.data.photos);
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

  /**
   * Open action
   * @param {*} item
   */
   const onClickDelete = (id) => {
    Alert.alert({
      title: 'Delete',
      message: `Do you want to delete an image`,
      action: [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("Yes"),
          onPress: () => onDelete(id),
        },
      ],
    });
  };

  /**
   * Action Delete/Reset
   **/
   const onDelete = async (id) => {
    let params = {
      id:id,
      post_id:item.id,
      type:'vehicle'
    }

    try {
      const response = await api.deleteImage(params);
      if(response.success){
        var newArrayList = [];
        newArrayList = oldImages.filter(item => item.id != id);
        setOldImages(newArrayList);
      }else{
        Alert.alert({
            message: response?.data?.error ?? response.error,
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
  };

  useEffect(() => {  
    if(selectedCategory?.name){
      setCategory(selectedCategory.name);
    }
  },[selectedCategory]);

  const onSelect = (category,title=null) => {
    //console.log(category);
    setSelectedCategory(category);
  };

  const onImages = images => {
    //console.log(data);
    //console.log(images);
    setImages(images);
    
  };

  const createPost = async () => {
    //console.log(category);
    if (title == '' || images.length==0 && oldImages.length==0 || location == '' || category == '' || price == '' || location == '') {
        setSuccess({
            ...success,
            title: title != '' ? true : false,
            images: images.length > 0 || oldImages.length > 0 ? true : false,
            // tags: tags.tagsArray.length > 0 ? true : false,
            location: location != '' ? true : false,
            price: price != '' ? true : false,
            category: category != '' ? true : false,
            description: description != '' ? true : false,
        });
        console.log(success);
    }else{
      if(!user){
        Alert.alert({
          message:  'You dont have permission please login.',
        });
        return false;
      }
      setLoading(true);
      let formdata = new FormData();
      
      for (let image of images) {
        formdata.append('images[]',{uri: image.uri, name: image.filename, type: 'image/jpg'})
      }

      formdata.append('title',title);
      formdata.append('id',item.id);
      formdata.append('tags',tags.tagsArray.join(','));
      formdata.append('location',location);
      formdata.append('locationData',JSON.stringify(locationData));
      formdata.append('price',price);
      formdata.append('api_token',user.token);
      formdata.append('category_id',selectedCategory.id);
      formdata.append('description',description);
      try {
          const response = await api.editVehicle(formdata,{
            'Content-Type': 'multipart/form-data'
          });
          if(response.success){
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

  const getCategories = async(params) => {
    try {
      const response = await api.getFormFields(params);
      if(response.success){
        setCategories(response.data.categories);
        //console.log(categories);
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
    navigation.navigate('ImageBrowser',{imageCount: 5,onImages:onImages})
  }

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
          onPress={(data, details = null) => { data.geometry=details?.geometry; setLocation(data.description);setLocationData(data);setViewtype(''); }}
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
          title={t('edit_vehicle')}
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
                  success={success.images}
                />
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                  {
                    oldImages.map((img,index) => {
                      return <><View key={"oldimg"+index} style={{position: 'relative'}}>
                      <Image style={{height: 50, width: 50, borderWidth: 2, backgroundColor:"#eaeaea", borderColor:"#333"}} key={index} source={{uri:img.image}} resizeMode="contain" />
                      <Icon
                        name="times"
                        size={14}
                        color={colors.primary}
                        onPress={() => onClickDelete(img.id)}
                        style={{position: 'absolute',top:2,right:3}}
                        enableRTL={true}
                      /></View></>
                    })
                  }
                </View>
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                  {
                    images.map((img,index) => {
                      return <Image style={{height: 50, width: 50, borderWidth: 2, backgroundColor:"#eaeaea", borderColor:"#333"}} key={index} source={{uri:img.uri}} resizeMode="contain" />
                    })
                  }
                </View>
                <Text body2 style={{marginTop: 5,color:BaseColor.grayColor}}>
                  <Text subhead semibold style={{color:BaseColor.grayColor}}>
                    Photos-0/5&nbsp;&nbsp;
                  </Text>
                  Choose your listing main photo first. Add more photos with multipple angles to show any damage or wear
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
                    onChangeText={text => setPrice(text)}
                    placeholder={t('Price')}
                    keyboardType = 'numeric'
                    success={success.price}
                    value={price}
                    onFocus={() => {
                        setSuccess({
                            ...success,
                            price: true,
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
                

                <TagInput
                  updateState={tags => setTags(tags)}
                  tags={tags}
                  placeholder="Tags..."                            
                  label='press enter to add tag'
                  labelStyle={{color: BaseColor.grayColor}}
                  containerStyle={{width: '100%',marginTop:10,backgroundColor: BaseColor.fieldColor}}
                  inputContainerStyle={{}}
                  inputStyle={[styles.textInput]}
                  tagStyle={styles.tag}
                  tagTextStyle={styles.tagText}
                  keysForTag={', '}
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
}
