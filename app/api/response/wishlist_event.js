import * as Utils from "@utils";
import { EventCollection } from "./collection";

export const getWishListEvent = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: EventCollection.filter((item) => item.favorite),
  };
};
