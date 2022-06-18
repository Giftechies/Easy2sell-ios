import React, {useState, useEffect} from 'react';
import * as api from '@api';
import {View, ScrollView, ImageBackground, KeyboardAvoidingView, Platform, Alert,TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle,BaseColor, Images, useTheme} from '@config';
import {useDispatch, useSelector} from 'react-redux';
import {userSelect} from '@selectors';
import DatePicker from 'react-native-datepicker';
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

export default function AddJob({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const user = useSelector(userSelect);
  //const [formFields, setFormFields] = useState([]);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [images, setImages] = useState([]);

  const [salaryType, setSalaryType] = useState('');
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [selectedSalaryType, setSelectedSalaryType] = useState({});

  const [description, setDescription] = useState('');
  const [minimumSalary, setMinimumSalary] = useState('');
  const [maximumSalary, setMaximumSalary] = useState('');
  const [location, setLocation] = useState('');
  const [viewtype, setViewtype] = useState('');
  const [locationData, setLocationData] = useState({});

  const [selectedCategory, setSelectedCategory] = useState({});
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [jobType, setJobType] = useState('');
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState({});

  const [loading, setLoading] = useState(false);
  
  const [success, setSuccess] = useState({
      title: true,
      images:true,
      businessName:true,
      contactEmail:true,
      salaryType:true,
      category:true,
      minimumSalary:true,
      maximumSalary:true,
      location:true,
      jobType: true,
      description:true,
  });

  useEffect(() => {  
    const params = {
      form_type:'job'
    };
    getJobtype(params);
  },[]);

  useEffect(() => {  
    if(selectedSalaryType?.name){
    setSalaryType(selectedSalaryType.name);
    }
  },[selectedSalaryType]);

  useEffect(() => {  
    if(selectedJobType?.name){
    setJobType(selectedJobType.name);
    }
  },[selectedJobType]);

  
  useEffect(() => {  
    if(selectedCategory?.name){
    setCategory(selectedCategory.name);
    }
  },[selectedCategory]);

  const onImages = images => {
    setImages(images);
  };

  const onSelect = (category,title=null) => {
    if(title=='select_job_type'){
      setSelectedJobType(category);
    }else if(title=='select_category'){
      setSelectedCategory(category);
    }
    else{
      setSelectedSalaryType(category);
    }
  };


  const createPost = async () => {
    if (title == '' || businessName == '' || category == '' || salaryType == '' || minimumSalary == '' || maximumSalary == '' || location == '' || jobType == '' || description == '') {
        setSuccess({
            ...success,
            title: title != '' ? true : false,
            images: images.length > 0 ? true : false,
            businessName: businessName != '' ? true : false,
            // tags: tags.tagsArray.length > 0 ? true : false,
            // /contactEmail: contactEmail != '' ? true : false,
            salaryType: salaryType != '' ? true : false,
            minimumSalary: minimumSalary != '' ? true : false,
            maximumSalary: maximumSalary != '' ? true : false,
            category: category != '' ? true : false,
            location: location != '' ? true : false,
            jobType: jobType != '' ? true : false,
            description: description != '' ? true : false,
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
      
      formdata.append('title',title);
      formdata.append('business_name',businessName);
      //formdata.append('contact_email',contactEmail);
      formdata.append('api_token',user.token);
      formdata.append('locationData',JSON.stringify(locationData));
      formdata.append('salary_type',selectedSalaryType.id);
      formdata.append('description',description);
      formdata.append('minimum_salary',minimumSalary);
      formdata.append('maximum_salary',maximumSalary);
      formdata.append('category_id',selectedCategory.id);
      formdata.append('maximum_salary',maximumSalary);
      formdata.append('location',location);
      formdata.append('job_type',selectedJobType.id);
      
      try {
          const response = await api.saveJob(formdata,{
            'Content-Type': 'multipart/form-data'
          });
          if(response.success){

            setTitle('');
            setBusinessName('');
            setContactEmail('');
            setCategory('');
            setImages([]);
           
            setDescription('');
            setMinimumSalary('');
            setMaximumSalary('');
            setLocation('');
            setLocationData({});
            setSelectedSalaryType({});
            setSelectedJobType({});
            setSalaryType('');
            setJobType('');
            
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

  const getJobtype = async(params) => {
    try {
      const response = await api.getFormFields(params);
      if(response.success){
        setCategories(response.data.categories);
        setJobTypes(response.data.job_type);
        setSalaryTypes(response.data.salary_type);
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
    navigation.navigate('ImageBrowser',{imageCount: 1, onImages:onImages})
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
          title={t('add_job')}
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
                  Choose your job banner image
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
                    onChangeText={text => setBusinessName(text)}
                    placeholder={t('business_name')}
                    success={success.businessName}
                    value={businessName}
                    onFocus={() => {
                        setSuccess({
                            ...success,
                            name: true,
                        });
                    }}
                />

                {/* <TextInput
                    style={{marginTop: 10}}
                    onChangeText={text => setContactEmail(text)}
                    placeholder={t('contact_email')}
                    success={success.contactEmail}
                    value={contactEmail}
                    onFocus={() => {
                        setSuccess({
                            ...success,
                            name: true,
                        });
                    }}
                /> */}
                <TouchableOpacity
                  style={[
                    styles.profileItem,
                  ]}
                  onPress={() => {
                    navigation.navigate('CommonSelectModel',{categories,title:'select_category',onSelect:onSelect});
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
                  onPress={() => {
                    navigation.navigate('CommonSelectModelB',{categories:salaryTypes,title:'select_salary_type',onSelect:onSelect});
                  }}>
                  <Text style={{color:!success.salaryType?colors.primary:colors.gray}}>{t('salary_type')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text grayColor>
                      {salaryType}
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
                    onChangeText={text => setMinimumSalary(text)}
                    placeholder={t('minimum_salary')}
                    keyboardType = 'numeric'
                    success={success.minimumSalary}
                    value={minimumSalary}
                    onFocus={() => {
                        setSuccess({
                            ...success,
                            minimumSalary: true,
                        });
                    }}
                />

                <TextInput
                    style={{marginTop: 10}}
                    onChangeText={text => setMaximumSalary(text)}
                    placeholder={t('maximum_salary')}
                    keyboardType = 'numeric'
                    success={success.maximumSalary}
                    value={maximumSalary}
                    onFocus={() => {
                        setSuccess({
                            ...success,
                            maximumSalary: true,
                        });
                    }}
                />

                <TouchableOpacity
                  style={[
                    styles.profileItem,
                  ]}
                  onPress={() => {
                    navigation.navigate('CommonSelectModelB',{categories:jobTypes,title:'select_job_type',onSelect:onSelect});
                  }}>
                  <Text style={{color:!success.jobType?colors.primary:colors.gray}}>{t('job_type')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text grayColor>
                      {jobType}
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
