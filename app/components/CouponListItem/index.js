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
export default function CouponListItem(props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    loading,
    grid,
    block,
    favorite,
    style,
    title,
    subtitle,
    address,
    phone,
    rate,
    numReviews,
    status,
    onPress,
    onPressTag,
  } = props;

  /**
   * Display place item as block
   */

  const renderBlock = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={style}>
            
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15,
              }}
            >
              <PlaceholderLine style={{ width: "50%" }} />
              <PlaceholderLine style={{ width: "80%" }} />
              <View style={styles.blockLineMap}>
                <PlaceholderLine style={{ width: "25%" }} />
              </View>
              { phone != '' &&
              <View style={styles.blockLinePhone}>
                <PlaceholderLine style={{ width: "50%" }} />
              </View>
              }
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress}>
          {status ? (
            <Tag status style={styles.tagStatus}>
              {t(status)}
            </Tag>
          ) : null}
          {favorite ? (
            <Icon
              solid
              name="heart"
              color={BaseColor.whiteColor}
              size={18}
              style={styles.iconLike}
            />
          ) : (
            <Icon
              name="heart"
              color={BaseColor.whiteColor}
              size={18}
              style={styles.iconLike}
            />
          )}
          <View style={styles.blockContentRate}>
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Tag rate onPress={onPressTag}>
                {rate}
              </Tag>
              <View style={{ marginLeft: 10 }}>
                <Text caption1 whiteColor semibold style={{ marginBottom: 5 }}>
                  {t("rate")}
                </Text>
                <StarRating
                  disabled={true}
                  starSize={10}
                  maxStars={5}
                  rating={rate}
                  selectedStar={onPressTag}
                  fullStarColor={BaseColor.yellowColor}
                />
              </View>
            </View> */}
            <Text caption1 semibold whiteColor style={{ marginTop: 5 }}>
              {numReviews} {t("feedback")}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text headline semibold grayColor>
            {subtitle}
          </Text>
          <Text title2 semibold style={{ marginTop: 4 }} numberOfLines={1}>
            {title}
          </Text>
          { address != '' &&
          <View style={styles.blockLineMap}>
            <Icon name="map-marker-alt" color={colors.primaryLight} size={12} />
            <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
              {address}
            </Text>
          </View>
          }
          { phone != '' &&
          <View style={styles.blockLinePhone}>
            <Icon name="dollar-sign" color={colors.primaryLight} size={12} />
            <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
              {phone}
            </Text>
          </View>
          }
        </View>
      </View>
    );
  };

  /**
   * Display place item as list
   */
  const renderList = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={[styles.listContent, style]}>
            
            <View style={styles.listContentRight}>
              <PlaceholderLine style={{ width: "50%" }} />
              <PlaceholderLine style={{ width: "70%" }} />
              <View style={styles.lineRate}>
                <PlaceholderLine style={{ width: "50%" }} />
              </View>
              <PlaceholderLine style={{ width: "50%" }} />
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <TouchableOpacity style={[styles.listContent, style]} onPress={onPress}>
        {status ? (
          <Tag status style={styles.listTagStatus}>
            {status}
          </Tag>
        ) : null}
        <View style={styles.listContentRight}>
          <Text footnote lightPrimaryColor numberOfLines={1}>
            {subtitle}
          </Text>
          <Text headline semibold numberOfLines={2} style={{ marginTop: 5 }}>
            {title}
          </Text>
          {/* <View style={styles.lineRate}>
            <Tag onPress={onPressTag} rateSmall style={{ marginRight: 5 }}>
              {rate}
            </Tag>
            <StarRating
              disabled={true}
              starSize={10}
              maxStars={5}
              rating={rate}
              fullStarColor={BaseColor.yellowColor}
            />
          </View> */}
          <Text caption1 grayColor style={{ marginTop: 10 }}>
            {address}
          </Text>
          {favorite ? (
            <Icon
              name="heart"
              color={colors.primaryLight}
              solid
              size={18}
              style={styles.iconListLike}
            />
          ) : (
            <Icon
              name="heart"
              color={colors.primaryLight}
              size={18}
              style={styles.iconListLike}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Display place item as grid
   */
  const renderGrid = () => {
    if (loading) {
      return (
        <View style={[styles.girdContent, style]}>
          <Placeholder Animation={Progressive}>
            <View style={[styles.girdContent, style]}>
             
              <PlaceholderLine style={{ width: "30%", marginTop: 8 }} />
              <PlaceholderLine style={{ width: "50%" }} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <PlaceholderLine style={{ width: "20%" }} />
              </View>
            </View>
          </Placeholder>
        </View>
      );
    }

    return (
      <TouchableOpacity style={[style]} onPress={onPress}>
        <View>
         
          {status ? (
            <Tag status style={styles.tagGirdStatus}>
              {status}
            </Tag>
          ) : null}
          {favorite ? (
            <Icon
              name="heart"
              color="white"
              solid
              size={18}
              style={styles.iconGirdLike}
            />
          ) : (
            <Icon
              name="heart"
              color="white"
              size={18}
              style={styles.iconGirdLike}
            />
          )}
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <Text
            footnote
            lightPrimaryColor
            style={{ marginTop: 5 }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
          <Text headline bold style={{ marginTop: 5 }} numberOfLines={2}>
            {title}
          </Text>
          { address != '' &&
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Icon name="map-marker-alt" size={12} color={colors.text} />
            <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
              {address}
            </Text>
          </View>
            }
        </View>
      
      </TouchableOpacity>
    );
  };

  if (grid) return renderGrid();
  else if (block) return renderBlock();
  else return renderList();
}

CouponListItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
  list: PropTypes.bool,
  block: PropTypes.bool,
  grid: PropTypes.bool,
  favorite: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  address: PropTypes.string,
  phone: PropTypes.string,
  rate: PropTypes.number,
  status: PropTypes.string,
  numReviews: PropTypes.number,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
};

CouponListItem.defaultProps = {
  style: {},
  loading: false,
  list: true,
  block: false,
  grid: false,
  favorite: false,
  title: "",
  subtitle: "",
  address: "",
  phone: "",
  rate: 4.5,
  numReviews: 0,
  status: "",
  onPress: () => {},
  onPressTag: () => {},
};
