import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Image, Text } from "@components";
import styles from "./styles";
import PropTypes from "prop-types";
import { useTheme } from "@config";
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from "rn-placeholder";
export default function ListThumbCircle(props) {
  const { colors } = useTheme();
  const {
    style,
    loading,
    imageStyle,
    image,
    txtLeftTitle,
    txtContent,
    txtRight,
    onPress,
  } = props;

  if (loading) {
    return (
      <Placeholder Animation={Progressive}>
        <View
          style={[
            styles.contain,
            { borderBottomWidth: 1, borderBottomColor: colors.border },
            style,
          ]}
        >
          <PlaceholderMedia style={[styles.thumb, imageStyle]} />
          <View style={styles.content}>
            <View style={styles.left}>
              <PlaceholderLine style={{ width: "50%" }} />
              <PlaceholderLine style={{ width: "70%" }} />
            </View>
            <View style={styles.right}>
              <PlaceholderLine style={{ width: "50%" }} />
            </View>
          </View>
        </View>
      </Placeholder>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.contain,
        { borderBottomWidth: 1, borderBottomColor: colors.border },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={image} style={[styles.thumb, imageStyle]} />
      <View style={styles.content}>
        <View style={styles.left}>
          <Text headline semibold>
            {txtLeftTitle}
          </Text>
          <Text
            note
            numberOfLines={1}
            footnote
            grayColor
            style={{
              paddingTop: 5,
            }}
          >
            {txtContent}
          </Text>
        </View>
        <View style={styles.right}>
          <Text caption2 grayColor numberOfLines={1}>
            {txtRight}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

ListThumbCircle.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
  imageStyle: PropTypes.object,
  image: PropTypes.node.isRequired,
  txtLeftTitle: PropTypes.string,
  txtContent: PropTypes.string,
  txtRight: PropTypes.string,
  onPress: PropTypes.func,
};

ListThumbCircle.defaultProps = {
  style: {},
  loading: false,
  imageStyle: {},
  image: "",
  txtLeftTitle: "",
  txtContent: "",
  txtRight: "",
  onPress: () => {},
};
