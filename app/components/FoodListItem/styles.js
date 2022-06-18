import { StyleSheet } from "react-native";
import * as Utils from "@utils";
import { BaseColor } from "@config";

export default StyleSheet.create({
  //block css
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
    height: Utils.scaleWithPixel(80),
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
    marginTop: 10,
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
  girdContent: {
    flex: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BaseColor.grayColor,
    marginHorizontal: 4,
  },
  lineStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  tagRate: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  iconGirdLike: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  contain: {
    flexDirection: "row",
    alignItems: "center",
  },
});
