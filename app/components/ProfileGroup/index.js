import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Image, Text } from "@components";
import styles from "./styles";
import PropTypes from "prop-types";

export default function ProfileGroup(props) {
  const { style, users, onPress, name, detail } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: "row", marginRight: 7 }}>
        {users.map((item, index) => {
          return (
            <Image
              key={index}
              source={item.image}
              style={[styles.thumb, index != 0 ? { marginLeft: -15 } : {}]}
            />
          );
        })}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
        }}
      >
        <Text headline semibold numberOfLines={1}>
          {name}
        </Text>
        <Text footnote grayColor numberOfLines={1}>
          {detail}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

ProfileGroup.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  users: PropTypes.array,
  name: PropTypes.string,
  detail: PropTypes.string,
  onPress: PropTypes.func,
};

ProfileGroup.defaultProps = {
  style: {},
  users: [],
  name: "",
  detail: "",
  onPress: () => {},
};
