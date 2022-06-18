import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  contain: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  thumb: {
    borderWidth: 2,
    borderColor: BaseColor.whiteColor,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
