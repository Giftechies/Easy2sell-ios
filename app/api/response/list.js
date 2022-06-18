import * as Utils from "@utils";
import { BaseCollection } from "./collection";

export const getList = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: BaseCollection,
  };
};
