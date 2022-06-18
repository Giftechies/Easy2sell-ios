import React, {useState, useEffect} from 'react';
import * as api from '@api';
import {View,Dimensions, ScrollView, ImageBackground, KeyboardAvoidingView, Platform, Alert,TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle,BaseColor, Images, useTheme} from '@config';
import {useDispatch, useSelector} from 'react-redux';
import {userSelect} from '@selectors';
import TagInput from 'react-native-tags-input';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
//import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
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

export default function AddRealEstate({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const user = useSelector(userSelect);
  //const [formFields, setFormFields] = useState([]);
  const [images, setImages] = useState([]);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState({});
  const [builtupArea, setBuiltupArea] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
 
  const [propertyType, setPropertyType] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState({});

  const [listedByType, setListedByType] = useState('');
  const [listedByTypes, setListedByTypes] = useState([]);
  const [selectedListedByType, setSelectedListedByType] = useState({});

  const [availableForType, setAvailableForType] = useState('');
  const [availableForTypes, setAvailableForTypes] = useState([]);
  const [selectedAvailableForType, setSelectedAvailableForType] = useState({});

  const [furnitureType, setFurnitureType] = useState('');
  const [furnitureTypes, setFurnitureTypes] = useState([]);
  const [selectedFurnitureType, setSelectedFurnitureType] = useState({});

  const [airConditioningType, setAirConditioningType] = useState('');
  const [airConditioningTypes, setAirConditioningTypes] = useState([]);
  const [selectedAirConditioningType, setSelectedAirConditioningType] = useState({});

  const [amenityType, setAmenityType] = useState('');
  const [amenityTypes, setAmenityTypes] = useState([]);
  const [selectedAmenityType, setSelectedAmenityType] = useState([]);
  

  const [viewtype, setViewtype] = useState('');
  const { height, width } = Dimensions.get( 'window' );
  const LATITUDE = 40.74333; // Korea Town, New York, NY 10001
  const LONGITUDE = -73.99033; // Korea Town, New York, NY 10001
  const LATITUDE_DELTA = 0.28;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [loading, setLoading] = useState(false);
  
  const [success, setSuccess] = useState({
      title: true,
      images:true,
      bedrooms:true,
      bathrooms:true,
      price:true,
      location:true,
      description:true,
      builtupArea:true,
      carpetArea:true,
      propertyType:true,
      listedByType:true,
      availableForType:true,
      furnitureType:true,
      airConditioningType:true,
      amenityType:true
  });

  const onRegionChange = (region) => {
    setRegion(region);
  }

  useEffect(() => {  
    const params = {
      form_type:'real_estate'
    };
    getFields(params);
  },[]);

  useEffect(() => {  
    if(selectedAmenityType?.name){
    setAmenityType(selectedAmenityType.name);
    }
  },[selectedAmenityType]);

  useEffect(() => {  
    if(selectedAirConditioningType?.name){
    setAirConditioningType(selectedAirConditioningType.name);
    }
  },[selectedAirConditioningType]);

  useEffect(() => {  
    if(selectedFurnitureType?.name){
    setFurnitureType(selectedFurnitureType.name);
    }
  },[selectedFurnitureType]);

  useEffect(() => {  
    if(selectedAvailableForType?.name){
    setAvailableForType(selectedAvailableForType.name);
    }
  },[selectedAvailableForType]);

  useEffect(() => {  
    if(selectedPropertyType?.name){
    setPropertyType(selectedPropertyType.name);
    }
  },[selectedPropertyType]);

  useEffect(() => {  
    if(selectedListedByType?.name){
    setListedByType(selectedListedByType.name);
    }
  },[selectedListedByType]);

  const onSelect = (category,title=null) => {
    if(title == 'select_property_type'){
        setSelectedPropertyType(category);
    }else if(title == 'select_available_for'){
        setSelectedAvailableForType(category);
    }
    else if(title == 'select_furniture_type'){
        setSelectedFurnitureType(category);
    }
    else if(title == 'select_air_conditioning_type'){
        setSelectedAirConditioningType(category);
    }
    else if(title == 'select_listed_by'){
        setSelectedListedByType(category);
    }
    else if(title == 'select_amenity_type'){
        setSelectedAmenityType(category);
    }else {

    }
  };

  const onImages = images => {
    setImages(images);
  };

  const createPost = async () => {
    if (title == '' || images.length==0 || bedrooms == '' || bathrooms == '' || location == '' || description == '' || propertyType == '' || availableForType == '') {
        setSuccess({
            ...success,
            title: title != '' ? true : false,
            images: images.length > 0 ? true : false,
            bedrooms: bedrooms != '' ? true : false,
            bathrooms: bathrooms != '' ? true : false,
            location: location != '' ? true : false,
            description: description != '' ? true : false,
            propertyType: propertyType != '' ? true : false,
            listedByType: listedByType != '' ? true : false,
            availableForType: availableForType != '' ? true : false,
        });
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
      
      for (let image of images) {
        formdata.append('images[]',{uri: image.uri, name: image.filename, type: 'image/jpg'})
      }
      let amenities = selectedAmenityType.map(s=>s.id);
      formdata.append('title',title);
      formdata.append('bedrooms',bedrooms);
      formdata.append('bathrooms',bathrooms);
      formdata.append('price',price);
      formdata.append('location',location);
      formdata.append('locationData',JSON.stringify(locationData));
      formdata.append('description',description);
      formdata.append('builtup_area',builtupArea);
      formdata.append('carpet_area',carpetArea);
      formdata.append('api_token',user.token);
      formdata.append('property_type',selectedPropertyType.id);
      formdata.append('listed_by',selectedListedByType.name);
      formdata.append('available_for',selectedAvailableForType.name);
      formdata.append('furniture',selectedFurnitureType.id);
      formdata.append('air_conditioning_type',selectedAirConditioningType.id);
      formdata.append('amenityType',amenities.join(','));

      try {
          const response = await api.saveRealEstate(formdata,{
            'Content-Type': 'multipart/form-data'
          });
          //console.log(response.data);
          if(response.success){
            setTitle('');
            setPrice(0);
            setDescription('');
            setBedrooms('');
            setBathrooms('');
            setLocation('');
            setLocationData({});
            setBuiltupArea('');
            setCarpetArea('');
            
            setSelectedPropertyType({});
            setSelectedListedByType({});
            setSelectedAvailableForType({});
            setSelectedFurnitureType({});
            setSelectedAirConditioningType({});
            setSelectedAmenityType([]);
            setPropertyType('');
            setListedByType('');
            setAvailableForType('');
            setFurnitureType('');
            setAirConditioningType('');
            setImages([]);
            setAmenityType('');
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

  const getFields = async(params) => {
    try {
      const response = await api.getFormFields(params);
      if(response.success){
        setPropertyTypes(response.data.property_type);
        setFurnitureTypes(response.data.furniture);
        setAvailableForTypes(response.data.available_for);
        setAirConditioningTypes(response.data.ac_type);
        setListedByTypes(response.data.listed_by);
        setAmenityTypes(response.data.amenities);
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
    navigation.navigate('ImageBrowser',{onImages:onImages,imageCount:5})
  }

  /**
   * render MapView
   * @returns
  */
  // const renderMapView = () => {
  //   return (
  //     <View style={{flex: 1}}>
  //       <MapView region={region} onRegionChange={()=>onRegionChange()} minZoomLevel={2} maxZoomLevel={10} provider={PROVIDER_GOOGLE} style={styles.map}>
  //       <Marker coordinate={region} />
  //       </MapView>
  //     </View>
  //   );
  // };

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
          title={t('add_property')}
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
                  navigation.navigate('CommonSelectModelB',{categories:propertyTypes,title:'select_property_type',onSelect:onSelect});
                }}>
                <Text style={{color:!success.propertyType?colors.primary:colors.gray}}>{t('property_type')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text grayColor>
                    {propertyType}
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
                  onChangeText={text => setBedrooms(text)}
                  placeholder={t('bedrooms')}
                  keyboardType = 'numeric'
                  success={success.bedrooms}
                  value={bedrooms}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          bedrooms: true,
                      });
                  }}
              />
              <TextInput
                  style={{marginTop: 10}}
                  onChangeText={text => setBathrooms(text)}
                  placeholder={t('bathrooms')}
                  keyboardType = 'numeric'
                  success={success.bathrooms}
                  value={bathrooms}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          bathrooms: true,
                      });
                  }}
              />
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
              {/* <TextInput
                  style={{marginTop: 10}}
                  onChangeText={text => setLocation(text)}
                  placeholder={t('location')}
                  success={success.location}
                  value={location}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          location: true,
                      });
                  }}
              /> */}
                <TouchableOpacity
                style={[
                  styles.profileItem,
                ]}
                onPress={() => {
                  navigation.navigate('CommonSelectModelB',{categories:availableForTypes,title:'select_available_for',onSelect:onSelect});
                }}>
                <Text style={{color:!success.availableForType?colors.primary:colors.gray}}>{t('available_for')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text grayColor>
                    {availableForType}
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
                  navigation.navigate('CommonMultiSelectModel',{categories:amenityTypes,title:'select_amenity_type',onSelect:onSelect});
                }}>
                <Text style={{color:!success.amenityType?colors.primary:colors.gray}}>{t('amenity_type')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  
                  { 
                    selectedAmenityType.map((item,index) => {if(index<2){ return <Text numberOfLines={1} style={{ width: 50 }} grayColor key={index}>{ (index ? ', ': '') + item.name} </Text>} })
                  }            
                
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
              <TextInput
                  style={{marginTop: 10}}
                  onChangeText={text => setBuiltupArea(text)}
                  placeholder={t('builtup_area') + ' Sqft'}
                  success={success.builtupArea}
                  value={builtupArea}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          builtupArea: true,
                      });
                  }}
              />
              <TextInput
                  style={{marginTop: 10}}
                  onChangeText={text => setCarpetArea(text)}
                  placeholder={t('carpet_area') + ' Sqft'}
                  success={success.carpetArea}
                  value={carpetArea}
                  onFocus={() => {
                      setSuccess({
                          ...success,
                          carpetArea: true,
                      });
                  }}
              />    
              
              {/* <TouchableOpacity
                style={[
                  styles.profileItem,
                ]}
                onPress={() => {
                  navigation.navigate('CommonSelectModelB',{categories:furnitureTypes,title:'select_furniture_type',onSelect:onSelect});
                }}>
                <Text style={{color:!success.furnitureType?colors.primary:colors.gray}}>{t('furniture')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text grayColor>
                    {furnitureType}
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
                  navigation.navigate('CommonSelectModelB',{categories:airConditioningTypes,title:'select_air_conditioning_type',onSelect:onSelect});
                }}>
                <Text style={{color:!success.airConditioningType?colors.primary:colors.gray}}>{t('air_conditioning_type')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text grayColor>
                    {airConditioningType}
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
                  navigation.navigate('CommonSelectModelB',{categories:listedByTypes,title:'select_listed_by',onSelect:onSelect});
                }}>
                <Text style={{color:!success.listedByType?colors.primary:colors.gray}}>{t('listed_by')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text grayColor>
                    {listedByType}
                  </Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{marginLeft: 5}}
                    enableRTL={true}
                  />
                </View>
              </TouchableOpacity> */}
  
              
              <Button
                  full
                  style={{marginTop: 20}}
                  loading={loading}
                  onPress={() => createPost()}>
                  {t('create_post')}
              </Button>
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
          </SafeAreaView>
      </View>
    );
  }
}
