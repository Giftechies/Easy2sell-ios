import * as Utils from "@utils";
import { EventCollection } from "./collection";

export const getProductDetailEvent = async ({ params }) => {
  await Utils.delay(1000);
  const item = EventCollection.find((item) => item.id == params.id);
  item.nearlys = EventCollection;
  return {
    success: true,
    data: item,
  };
};
