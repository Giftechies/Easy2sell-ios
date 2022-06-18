import React, {useState} from 'react';
import {Text, Image} from '@components';
import {TouchableOpacity, View} from 'react-native';
import {useTheme, Images} from '@config';
import {useTranslation} from 'react-i18next';
import {designSelect, userSelect} from '@selectors';
import {useSelector, useDispatch} from 'react-redux';
import {configActions} from '@actions';
import styles from './styles';

export default function ChooseBusiness({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const design = useSelector(designSelect);
  const user = useSelector(userSelect);
  const dispatch = useDispatch();

  const business = [
    {key: 'add_construction', image: Images.construction, title: 'Construction'},
    {key: 'add_vehicle', image: Images.car, title: 'Vehicle'},
    {key: 'add_real_estate', image: Images.property, title: 'Real Estate'},
    {key: 'add_item', image: Images.item, title: 'Item'},
    {key: 'add_job', image: Images.job, title: 'Job'},
    {key: 'add_coupon', image: Images.coupon, title: 'Coupon'},
  ];

  const [selected, setSelected] = useState(design);
  /**
   *
   * onSave ChooseBusiness
   */
  const onSaveBusiness = () => {
    //console.log(selected);
    if(selected=='add_item'){
      navigation.navigate('AddItem');
    }
    else if(selected=='add_coupon') {
      navigation.navigate('AddCoupon');
    }   
    else if(selected=='add_job') {
      navigation.navigate('AddJob');
    } 
    else if(selected=='add_real_estate') {
      navigation.navigate('AddRealEstate');
    }  
    else if(selected=='add_construction') {
      navigation.navigate('AddConstruction');
    }  
    else if(selected=='add_vehicle') {
      navigation.navigate('AddVehicle');
    }  
    else{
      navigation.navigate('AddConstruction');
    }
    //dispatch(configActions.onSetup(selected, user));
    //navigation.goBack();
  };

  return (
    <View style={styles.contain}>
      <View style={[styles.content, {backgroundColor: colors.card}]}>
        <Text title3 medium style={{padding: 10}}>
          Choose Your Business
        </Text>
        <View style={styles.wrapContent}>
          {business.map((item, index) => {
            const color = selected == item.key ? colors.primary : colors.card;
            return (
              <TouchableOpacity
                onPress={() => setSelected(item.key)}
                style={{alignItems: 'center', padding: 10}}
                key={item.key}>
                <Image
                  style={[styles.image, {borderColor: color}]}
                  source={item.image}
                />
                <Text
                  footnote
                  style={{
                    marginTop: 10,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={[styles.contentButton, {borderTopColor: colors.border}]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}>
            <Text body2 semibold>
              {t('close')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderLeftColor: colors.border,
                borderLeftWidth: 0.5,
              },
            ]}
            onPress={onSaveBusiness}>
            <Text body2 semibold>
              {t('done')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
