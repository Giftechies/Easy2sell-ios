import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { BaseStyle, useTheme, BaseSetting, BaseColor } from "@config";
import { Header, SafeAreaView, TextInput, Icon, Text } from "@components";
import { applicationActions } from "@actions";
import styles from "./styles";

export default function CommonMultiSelectModel({ route,navigation }) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { categories, onSelect, title } = route?.params;

  const [loading, setLoading] = useState("");
  //const [country, setCountry] = useState("");
  const [categorySelected, setCategorySelected] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState('');

  /**
   * @description Called when setting language is selected
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {string} select
   */
  const onChange = (select) => {
      
    setCategorySelected((prevState) =>  {
        //console.log(prevState);
        if(prevState.some(cat => cat.id === select.id)){
            prevState = prevState.filter(function(c) { 
                return c.id !== select.id
            })
        return prevState
        }
        return [...prevState, select]
    });
  };

  
  useEffect(() => {  
    setAllCategories(categories);
  },[]);


  /**
   * Called when apply change language
   */
  const saveCategory = () => {
    if (!loading) {
      setLoading(true);
      //console.log(categorySelected);
      onSelect(categorySelected,title);
      navigation.goBack();
    }
  };

  const filterCategory = (text) => {
      const text1=text.toLowerCase();
    if (text) {
        setCategory(text);
        setAllCategories(
            categories.filter((item) => item.name.toLowerCase().includes(text1))
        );
    } else {
      setCategory('');
      setAllCategories(
        categories
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={ title ? title : t("select_category") }
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
        renderRight={() => {
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          } else {
            return (
              <Text headline primaryColor numberOfLines={1}>
                {t("save")}
              </Text>
            );
          }
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={saveCategory}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={["right", "left"]}>
        <View style={styles.contain}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
            <TextInput
              onChangeText={filterCategory}
              placeholder={t("search_category")}
              value={category}
              icon={
                <TouchableOpacity>
                  <Icon name="times" size={16} color={BaseColor.grayColor} />
                </TouchableOpacity>
              }
            />
          </View>
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={allCategories}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => {
              //const selected =  categorySelected.findIndex(obj => obj.id == item.id);
              const selected = categorySelected.some(cat => cat.id === item.id);
              //const selected = false;
              const hasChild = item?.children?.length ? true : false;
              const childitems = item?.children?.length;
              //console.log(selected);
              
              return (
                <>
                <TouchableOpacity key={item.id}
                  style={[styles.item, { borderBottomColor: colors.border },hasChild
                    ? {
                        backgroundColor: BaseColor.fieldColor,
                        paddingHorizontal:10,
                        borderBottomColor:BaseColor.fieldColor,
                        fontWeight:"bold"
                      }
                    : {}]}
                  onPress={() => !hasChild? onChange(item): {}}
                >
                  
                  <Text
                    body2                    
                    style={[
                      selected
                        ? {
                            color: colors.primary,
                          }
                        : {},
                        ,hasChild
                      ? {
                          fontWeight:"bold"
                        }
                      : {}
                    ]
                    }
                  >
                    {item.name}
                  </Text>
                  {selected && (
                    <Icon name="check" size={14} color={colors.primary} />
                  )}
                </TouchableOpacity>

                { item?.children?.length && <View style={{paddingHorizontal:10}}><FlatList
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                  data={item.children}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item,index }) => {
                    //console.log(subitem);
                    //const selected = categorySelected.findIndex(obj => obj.id == item.id);
                    const selected = categorySelected.some(cat => cat.id === item.id);
                    const lastelement = childitems == (index +1)
                    return (
                      <TouchableOpacity key={item.id}
                        style={[styles.item,lastelement
                          ? {
                              borderBottomColor:BaseColor.fieldColor
                            }
                          : {borderBottomColor: colors.border}]}
                        onPress={() => onChange(item)}
                      >
                        <Text
                          body2
                          style={[
                            selected
                              ? {
                                  color: colors.primary,
                                }
                              : {}
                          ]
                          }
                        >
                          {item.name}
                        </Text>
                        {selected && (
                          <Icon name="check" size={14} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                /></View>}
                </>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
