import { StyleSheet } from "react-native";
import * as Utils from "@utils";

export default StyleSheet.create({
  blockImage: {
    height: Utils.scaleWithPixel(200),
    width: "100%",
  },
  tagStatus: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  iconLike: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  blockContentRate: {
    position: "absolute",
    bottom: 5,
    right: 10,
  },
  blockLineMap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  blockLinePhone: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  //list css
  listImage: {
    height: Utils.scaleWithPixel(100),
    width: Utils.scaleWithPixel(80),
    borderRadius: 8,
  },
  listContent: {
    flexDirection: "row",
  },
  listContentRight: {
    paddingLeft: 10,
    paddingVertical: 5,
    flex: 1,
  },
  lineRate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  listTagStatus: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  iconListLike: {
    position: "absolute",
    bottom: 5,
    right: 0,
  },
  //gird css
  girdImage: {
    borderRadius: 8,
    height: Utils.scaleWithPixel(120),
    width: "100%",
  },
  tagGirdStatus: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  iconGirdLike: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
});
