import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Image, Text, Icon, StarRating, Tag } from "@components";
import { BaseColor, useTheme } from "@config";
import PropTypes from "prop-types";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from "rn-placeholder";
export default function PackageItem(props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    loading,
    checked,
    style,
    title,
    price,
    subtitle,
    days,
    ads,
    onPress,
  } = props;

  const renderSmall = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={[styles.contain, style]}>
            <PlaceholderMedia style={styles.smallImage} />
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: "center",
                flex: 1,
              }}
            >
              <PlaceholderLine style={{ width: "80%" }} />
              <PlaceholderLine style={{ width: "55%" }} />
              <PlaceholderLine style={{ width: "75%" }} />
            </View>
          </View>
        </Placeholder>
      );
    }

  
    return (
      <TouchableOpacity style={[styles.contain, style]} onPress={onPress}>
          {checked ? (
            <View style={styles.moreButton}>
                <Icon
                solid
                name="check"
                color={colors.primary}
                size={18}
                style={styles.iconLike}
                />
            </View>
          ) : 
            <View style={styles.moreButton}>
                <Icon
                solid
                name="check"
                color={colors.gray}
                size={18}
                style={styles.iconLike}
                />
            </View>
        }
        <View
          style={{ paddingHorizontal: 10, justifyContent: "center", flex: 1 }}
        >
          <Text headline semibold numberOfLines={1}>
            {title}
          </Text>
          <Text footnote semibold grayColor style={{ marginTop: 4 }}>
            {subtitle}
          </Text>
          <Text footnote semibold grayColor style={{ marginTop: 4 }}>
            {days} days
          </Text>
          <Text footnote semibold grayColor style={{ marginTop: 4 }}>
            {price}
          </Text>
          <Text footnote semibold grayColor style={{ marginTop: 4 }}>
            Paid Listing {ads}
          </Text>
        </View>
        
      </TouchableOpacity>
    );
  };

  return renderSmall();
}

PackageItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
  checked: PropTypes.bool,
  title: PropTypes.string,
  price: PropTypes.string,
  subtitle: PropTypes.string,
  days: PropTypes.string,
  ads: PropTypes.string,
  onPress: PropTypes.func
};

PackageItem.defaultProps = {
  style: {},
  loading: false,
  checked: false,
  title: "",
  price: "",
  subtitle: "",
  days: "",
  ads: "",
  onPress: () => {}
};
