import * as Utils from "@utils";
import { BaseCollection } from "./collection";

export const getWishList = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: BaseCollection.filter((item) => item.wishlist),
  };
};
