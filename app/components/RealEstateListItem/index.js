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
export default function RealEstateListItem(props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    loading,
    block,
    grid,
    card,
    favorite,
    style,
    image,
    title,
    subtitle,
    address,
    phone,
    rate,
    numReviews,
    status,
    price,
    onPress,
    onPressTag
  } = props;

  /**
   * Display place item as block
   */
  const renderBlock = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={style}>
            <PlaceholderMedia style={styles.blockImage} />
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
              <View style={styles.blockLinePhone}>
                <PlaceholderLine style={{ width: "50%" }} />
              </View>
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress}>
          <Image source={image} style={styles.blockImage} />
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
          <View style={styles.blockLineMap}>
            <Icon name="map-marker-alt" color={colors.primaryLight} size={12} />
            <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
              {address}
            </Text>
          </View>
          { phone != '' &&
          <View style={styles.blockLinePhone}>
            <Icon name="phone" color={colors.primaryLight} size={12} />
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
            <PlaceholderMedia style={styles.listImage} />
            <View style={styles.listContentRight}>
              <PlaceholderLine style={{ width: "50%" }} />
              <PlaceholderLine style={{ width: "70%" }} />
              <View style={styles.lineRate}>
                <PlaceholderLine style={{ width: "50%" }} />
              </View>
              <PlaceholderLine style={{ width: "50%" }} />
              <PlaceholderLine style={{ width: "50%" }} />
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <TouchableOpacity style={[styles.listContent, style]} onPress={onPress}>
        <Image source={image} style={styles.listImage} />
        {status ? (
          <Tag status style={styles.listTagStatus}>
            {status}
          </Tag>
        ) : null}
        <View style={styles.listContentRight}>
          <Text title2 semibold>
            {title}
          </Text>
          <Text headline semibold grayColor style={{ marginTop: 5 }}>
            {subtitle}
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
            {address??location}
          </Text>
          {price && price>0 ? <Text headline semibold style={{ marginTop: 10 }}>
            {price}
          </Text>:null}
          
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
              <PlaceholderMedia style={styles.girdImage} />
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
              <PlaceholderLine style={{ width: "30%" }} />
            </View>
          </Placeholder>
        </View>
      );
    }

    return (
      <TouchableOpacity style={[styles.girdContent, style]} onPress={onPress}>
        <View>
          <Image source={image} style={styles.girdImage} />
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
          <Text headline bold style={{ marginTop: 5 }} numberOfLines={1}>
            {title}
          </Text>
          <Text footnote grayColor style={{ marginTop: 5 }} numberOfLines={1}>
            {subtitle}
          </Text>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Tag onPress={onPressTag} rateSmall style={{ marginRight: 5 }}>
              {rate}
            </Tag>
            <StarRating
              disabled={true}
              starSize={10}
              maxStars={5}
              rating={rate}
              selectedStar={onPressTag}
              fullStarColor={BaseColor.yellowColor}
            />
          </View> */}
          {/* <Text headline semibold style={{ marginTop: 4 }}>
            {price}
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCard = () => {
    if (loading) {
      return (
        <View style={[styles.girdContent, style]}>
          <Placeholder Animation={Progressive}>
            <PlaceholderMedia style={styles.cardImage} />
          </Placeholder>
        </View>
      );
    }

    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress}>
          <Image source={image} style={styles.cardImage} />
          {status ? (
            <Tag status style={styles.tagStatus}>
              {status}
            </Tag>
          ) : null}
          {favorite ? (
            <Icon
              solid
              name="heart"
              color={BaseColor.whiteColor}
              size={24}
              style={styles.iconLike}
            />
          ) : (
            <Icon
              name="heart"
              color={BaseColor.whiteColor}
              size={24}
              style={styles.iconLike}
            />
          )}
          <View style={styles.cardBottomLeft}>
            <Text headline semibold whiteColor>
              {title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Icon
                name="map-marker-alt"
                color={colors.primaryLight}
                size={12}
              />
              <Text caption1 whiteColor style={{ paddingHorizontal: 4 }}>
                {address}
              </Text>
            </View>
          </View>
          
          {price && price>0 ? <View style={styles.cardBottomRight}>
            <Text headline semibold whiteColor>
              {price}
            </Text>
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text
                caption1
                whiteColor
                semibold
                style={{ paddingHorizontal: 5 }}
              >
                {rate}
              </Text>
              <StarRating
                disabled={true}
                starSize={10}
                maxStars={5}
                rating={rate}
                fullStarColor={BaseColor.yellowColor}
              />
            </View> */}
          </View>:null}
          
        </TouchableOpacity>
      </View>
    );
  };

  if (grid) return renderGrid();
  else if (block) return renderBlock();
  else if (card) return renderCard();
  else return renderList();
}

RealEstateListItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  block: PropTypes.bool,
  list: PropTypes.bool,
  grid: PropTypes.bool,
  card: PropTypes.bool,
  favorite: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  address: PropTypes.string,
  phone: PropTypes.string,
  rate: PropTypes.number,
  status: PropTypes.string,
  numReviews: PropTypes.number,
  price: PropTypes.string,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
};

RealEstateListItem.defaultProps = {
  style: {},
  image: "",
  loading: false,
  block: false,
  list: true,
  grid: false,
  card: false,
  favorite: false,
  title: "",
  subtitle: "",
  address: "",
  phone: "",
  rate: 4.5,
  numReviews: 0,
  status: "",
  price: "0",
  onPress: () => {},
  onPressTag: () => {},
};
