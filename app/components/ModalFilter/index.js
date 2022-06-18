import Button from "@components/Button";
import Icon from "@components/Icon";
import Image from "@components/Image";
import Text from "@components/Text";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import styles from "./styles";

const ModalFilter = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cardColor = colors.card;
  const { options, onApply, onSelectFilter, ...attrs } = props;

  return (
    <Modal swipeDirection={["down"]} style={styles.bottomModal} {...attrs}>
      <View
        style={[styles.contentFilterBottom, { backgroundColor: cardColor }]}
      >
        <View style={styles.contentSwipeDown}>
          <View style={styles.lineSwipeDown} />
        </View>
        {options.map((item, index) => (
          <TouchableOpacity
            style={[
              styles.contentActionModalBottom,
              {
                borderBottomColor: colors.border,
                borderBottomWidth:
                  index == options.length - 1 ? 0 : StyleSheet.hairlineWidth,
              },
            ]}
            key={item.value}
            onPress={() => onSelectFilter(item)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.image && <Image source={item.image} style={styles.image} />}
              <Text body2 semibold primaryColor={item.checked}>
                {t(item.text)}
              </Text>
            </View>
            {item.checked && (
              <Icon name="check" size={14} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
        <Button
          full
          style={{ marginTop: 10, marginBottom: 20 }}
          onPress={onApply}
        >
          {t("apply")}
        </Button>
      </View>
    </Modal>
  );
};

ModalFilter.defaultProps = {
  options: [],
  onApply: () => {},
  onSelectFilter: () => {},
};

ModalFilter.propTypes = {
  options: PropTypes.array,
  onApply: PropTypes.func,
  onSelectFilter: PropTypes.func,
};

export default ModalFilter;
