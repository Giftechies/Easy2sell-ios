import React, {useState,useEffect} from 'react';
import {View, FlatList, TouchableOpacity, ScrollView, Settings} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Tag, RangeSlider} from '@components';
import * as Utils from '@utils';
import styles from './styles';
import {settingSelect} from '@selectors';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import { createIconSetFromFontello } from 'react-native-vector-icons';

export default function Filter({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const setting = useSelector(settingSelect);
  const filter = route?.params?.filter;
  const itemType = route?.params?.itemType;
  

  const [priceBegin, setPriceBegin] = useState(filter?.minPrice ? filter?.minPrice : setting.priceMin ?? 0);
  const [priceEnd, setPriceEnd] = useState(filter?.maxPrice ? filter?.maxPrice : setting.priceMax ?? 100);
  const [selectedCategory, setCategory] = useState(filter?.category ?? []);
  const [selectedConditions, setConditions] = useState(filter?.conditions ?? []);
  const [selectedPropertyTypes, setPropertyTypes] = useState(filter?.propertytypes ?? []);
  const [selectedAvailableFor, setAvailableFor] = useState(filter?.availablefor ?? []);
  const [selectedJobtypes, setJobtypes] = useState(filter?.jobtypes ?? []);
  
  //const [selectedFacilities, setFacilities] = useState(filter?.feature ?? []);
  //const [businessColor, setBusinessColor] = useState(filter?.color);
  //const [location, setLocation] = useState(filter?.location);
  const [scrollEnabled, setScrollEnabled] = useState(true);


  useEffect(()=>{
    //console.log(setting);
    //console.log(priceEnd);
  },[])
  /**
   * on Apply filter
   *
   */
  const onApply = () => {
    //console.log('here');
    filter.category = selectedCategory;
    filter.jobtypes = selectedJobtypes;
    filter.availablefor = selectedAvailableFor;
    filter.propertytypes = selectedPropertyTypes;
    filter.conditions = selectedConditions;
    //filter.feature = selectedFacilities;
    //filter.color = businessColor;
    //filter.location = location;
    //console.log(filter.maxPrice);
    //if (setting?.priceMin != priceBegin || setting?.priceMax != priceEnd) {
      filter.minPrice = priceBegin;
      filter.maxPrice = priceEnd;
    //}
    
    //console.log(filter.maxPrice);
    //console.log(filter);
    route.params?.onApply?.(filter);
    navigation.goBack();
  };

  /**
   * @description Called when filtering option > location
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  const onNavigateLocation = () => {
    navigation.navigate('PickerScreen', {
      onApply: async location => {
        setLocation(location);
      },
      selected: location,
      data: setting?.locations,
    });
  };

  /**
   * @description Called when filtering option > category
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */
  const onSelectCategory = select => {
    const exist = selectedCategory.some(item => item.id === select.id);
    if (exist) {
      setCategory(selectedCategory.filter(item => item.id != select.id));
    } else {
      setCategory(selectedCategory.concat(select));
    }
  };

  const onSelectCondition = select => {
    //console.log(selectedConditions);
    const exist = selectedConditions.some(item => item === select);
    if (exist) {
      setConditions(selectedConditions.filter(item => item != select));
    } else {
      setConditions(selectedConditions.concat(select));
    }
  };
  
  const onSelectJobtype = select => {
    //console.log(selectedConditions);
    const exist = selectedJobtypes.some(item => item === select);
    if (exist) {
      setJobtypes(selectedJobtypes.filter(item => item != select));
    } else {
      setJobtypes(selectedJobtypes.concat(select));
    }
  };
  
  const onSelectPropertyType = select => {
    //console.log(selectedConditions);
    const exist = selectedPropertyTypes.some(item => item === select);
    if (exist) {
      setPropertyTypes(selectedPropertyTypes.filter(item => item != select));
    } else {
      setPropertyTypes(selectedPropertyTypes.concat(select));
    }
  };
  
  const onSelectAvailableFor = select => {
    //console.log(selectedConditions);
    const exist = selectedAvailableFor.some(item => item === select);
    if (exist) {
      setAvailableFor(selectedAvailableFor.filter(item => item != select));
    } else {
      setAvailableFor(selectedAvailableFor.concat(select));
    }
  };

  /**
   * on select Feature
   * @param {*} select
   */
  // const onSelectFeature = select => {
  //   const exist = selectedFacilities.some(item => item.id === select.id);
  //   if (exist) {
  //     setFacilities(selectedFacilities.filter(item => item.id != select.id));
  //   } else {
  //     setFacilities(selectedFacilities.concat(select));
  //   }
  // };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('apply')}
            </Text>
          );
        }}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => onApply()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <ScrollView
          scrollEnabled={scrollEnabled}
          onContentSizeChange={(contentWidth, contentHeight) =>
            setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
          }>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            {setting?.categories && <>
            <Text headline semibold>
              {t('category').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {setting?.categories?.map?.(item => {
                const selected = selectedCategory.some(i => i.id === item.id);
                return (
                  <Tag
                    primary={selected}
                    outline={!selected}
                    key={item.id.toString()}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                    }}
                    onPress={() => onSelectCategory(item)}>
                    {item.title}
                  </Tag>
                );
              })}
            </View>
            </>
            }
            {setting?.conditions && <>
            <Text headline semibold>
              {t('condition').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {setting?.conditions?.map?.((item ,index) => {
                const selected = selectedConditions.some(i => { return i === index; });
                return (
                  <Tag
                    primary={selected}
                    outline={!selected}
                    key={item.toString()}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                    }}
                    onPress={() => onSelectCondition(index)}>
                    {item}
                  </Tag>
                );
              })}
            </View>
            </>
            }
            {setting?.jobtypes && <>
            <Text headline semibold>
              {t('job_type').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {setting?.jobtypes?.map?.((item,index) => {
                const selected = selectedJobtypes.some(i => { return i === index; });
                return (
                  <Tag
                    primary={selected}
                    outline={!selected}
                    key={index.toString()}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                    }}
                    onPress={() => onSelectJobtype(index)}>
                    {item}
                  </Tag>
                );
              })}
            </View>
            </>
            }
            
            {setting?.propertytypes && <>
            <Text headline semibold>
              {t('property_type').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {setting?.propertytypes?.map?.((item,index) => {
                const selected = selectedPropertyTypes.some(i => { return i === index; });
                return (
                  <Tag
                    primary={selected}
                    outline={!selected}
                    key={index.toString()}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                    }}
                    onPress={() => onSelectPropertyType(index)}>
                    {item}
                  </Tag>
                );
              })}
            </View>
            </>
            }
            
            {setting?.availablefor && <>
            <Text headline semibold>
              {t('available_for').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {Object.keys(setting?.availablefor ?? {})?.map?.((item,index) => {
                const selected = selectedAvailableFor.some(i => { return i === item; });
                return (
                  <Tag
                    primary={selected}
                    outline={!selected}
                    key={index.toString()}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                    }}
                    onPress={() => onSelectAvailableFor(item)}>
                    {item}
                  </Tag>
                );
              })}
            </View>
            </>
            }
            {/* <Text headline semibold style={{marginTop: 20}}>
              {t('facilities').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {setting?.features?.map?.(item => {
                const selected = selectedFacilities.some(i => i.id === item.id);
                return (
                  <Tag
                    onPress={() => onSelectFeature(item)}
                    icon={
                      <Icon
                        name={Utils.iconConvert(item.icon)}
                        size={12}
                        color={colors.accent}
                        solid
                        style={{marginRight: 5}}
                      />
                    }
                    chip
                    key={item.id.toString()}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                      borderColor: selected ? colors.primary : colors.accent,
                    }}>
                    {item.title}
                  </Tag>
                );
              })}
            </View> */}
            {/* <TouchableOpacity
              style={styles.locationContent}
              onPress={() => onNavigateLocation()}>
              <View>
                <Text headline semibold>
                  {t('location').toUpperCase()}
                </Text>
                {location ? (
                  <Text footnote primaryColor style={{marginTop: 5}}>
                    {location.title}
                  </Text>
                ) : (
                  <Text footnote grayColor style={{marginTop: 5}}>
                    {t('please_select')}
                  </Text>
                )}
              </View>
              <Icon name="angle-right" size={18} color={BaseColor.grayColor} />
            </TouchableOpacity> */}
            {(itemType && itemType!='Construction' && itemType!='Coupons') ? <><Text headline semibold style={{marginTop: 20}}>
              {t( setting.priceTitle ?? 'price' ).toUpperCase()}
            </Text>
            <View style={styles.contentRange}>
              <Text caption1 grayColor>
                ${setting?.priceMin ?? 0}
              </Text>
              <Text caption1 grayColor>
                ${setting?.priceMax ?? 100}
              </Text>
            </View>
            <RangeSlider
              max={setting.priceMax}
              color={colors.border}
              low={priceBegin}
              high={priceEnd}
              selectionColor={colors.primary}
              onValueChanged={(low, high) => {
                setPriceBegin(low);
                setPriceEnd(high);
              }}
            />
            <View style={styles.contentResultRange}>
              <Text caption1>{t('avg_price')}</Text>
              <Text caption1>
                ${priceBegin} - ${priceEnd}
              </Text>
            </View>
          </> :null}
          </View>
          {/* <Text
            headline
            semibold
            style={{
              paddingHorizontal: 20,
              marginTop: 5,
            }}>
            {t('business_color').toUpperCase()}
          </Text>
          <FlatList
            contentContainerStyle={{paddingVertical: 10}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={setting?.color ?? []}
            keyExtractor={(item, index) => item}
            renderItem={({item, index}) => {
              const checked = item == businessColor;
              return (
                <TouchableOpacity
                  style={[
                    styles.circleIcon,
                    {backgroundColor: item, shadowColor: colors.border},
                  ]}
                  onPress={() => setBusinessColor(item)}>
                  {checked && (
                    <Icon name="check" size={16} color={BaseColor.whiteColor} />
                  )}
                </TouchableOpacity>
              );
            }}
          /> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Object.defineProperty(String.prototype, 'capitalize', {
//   value: function() {
//     return this.charAt(0).toUpperCase() + this.slice(1);
//   },
//   enumerable: false
// });