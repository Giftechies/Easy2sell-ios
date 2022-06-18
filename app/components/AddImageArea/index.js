import React from "react";
import { TextInput, View,Text, I18nManager,TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { BaseStyle, BaseColor, useTheme, useFont } from "@config";

export default function Index(props) {
  const { colors } = useTheme();
  const font = useFont();
  const cardColor = colors.card;
  const { style, success, icon,placeHolder ,callback, openBrowser} = props;
  
  return (
    <TouchableOpacity style={[BaseStyle.addImagesArea, { backgroundColor: cardColor }, style]} onPress={()=>openBrowser()}> 
      <Text style={{color:success ? BaseColor.grayColor : colors.primary}}>{icon} {placeHolder}</Text>
    </TouchableOpacity>
  );
}

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  success: PropTypes.bool,
  icon: PropTypes.node,
  callback:PropTypes.func,
  openBrowser:PropTypes.func
};

Index.defaultProps = {
  style: {},
  success: true,
  icon: null,
  placeHolder: "Add Images",
  callback: () => {},
  openBrowser: () => {}
};