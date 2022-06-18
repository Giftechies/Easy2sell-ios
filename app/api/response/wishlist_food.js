import { FoodCollection } from "./collection";
import * as Utils from "@utils";

export const getWishListFood = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: FoodCollection.filter((item) => item.favorite),
  };
};
