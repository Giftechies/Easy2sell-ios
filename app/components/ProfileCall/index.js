import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Image, Text, Icon } from "@components";
import PropTypes from "prop-types";
import styles from "./styles";
import { useTheme } from "@config";

export default function Index(props) {
  const { colors } = useTheme();
  const { style, image, title, subtitle, mobile,code, onPressMessenger, onPressPhone, onPressCopy,showmessenger } =
    props;
  return (
    <View style={[styles.content, style]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image style={styles.icon} source={{uri:image}} />
        <View style={{ marginLeft: 8 }}>
          <Text body1>{title}</Text>
          {/* <Text footnote style={{ marginTop: 4 }}>
            {subtitle}
          </Text> */}
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        
        {code && <TouchableOpacity
          onPress={onPressCopy}
          style={[styles.icon, { marginRight: 10, backgroundColor: colors.primaryLight }]}
        >
          <Icon name="copy" size={24} color="white" />
        </TouchableOpacity>}
        {mobile && <TouchableOpacity
          onPress={onPressPhone}
          style={[styles.icon, { marginRight: 10, backgroundColor: colors.primaryLight }]}
        >
          <Icon name="mobile-alt" size={24} color="white" />
        </TouchableOpacity>}
        {showmessenger &&
        <TouchableOpacity
          onPress={onPressMessenger}
          style={[
            styles.icon,
            { marginRight: 0, backgroundColor: colors.primaryLight },
          ]}
        >
          <Icon name="facebook-messenger" size={24} color="white" />
        </TouchableOpacity> }

        
      </View>
    </View>
  );
}

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.string,
  title: PropTypes.string,
  showmessenger: PropTypes.bool,
  subtitle: PropTypes.string,
  onPressMessenger: PropTypes.func,
  onPressPhone: PropTypes.func,
  onPressCode: PropTypes.func,
};

Index.defaultProps = {
  style: {},
  showmessenger:true,
  image: "",
  title: "",
  subtitle: "",
  onPressMessenger: () => {},
  onPressPhone: () => {},
  onPressCopy: () => {},
};
