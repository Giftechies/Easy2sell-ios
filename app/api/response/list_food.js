import * as Utils from "@utils";
import { FoodCollection } from "./collection";

export const getListFood = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: FoodCollection,
  };
};
