import * as Utils from "@utils";
import { RealEstateCollection } from "./collection";

export const getWishListRealEstate = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: RealEstateCollection.filter((item) => item.favorite),
  };
};
