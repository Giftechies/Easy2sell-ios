import * as Utils from "@utils";
import { FoodCollection } from "./collection";

export const getProductDetailFood = async ({ params }) => {
  await Utils.delay(1000);
  const item = FoodCollection.find((item) => item.id == params.id);
  item.nearlys = FoodCollection;
  return {
    success: true,
    data: FoodCollection.find((item) => item.id == params.id),
  };
};
