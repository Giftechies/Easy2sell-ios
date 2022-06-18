import * as Utils from "@utils";
import { RealEstateCollection } from "./collection";

export const getProductDetailRealEstate = async ({ params }) => {
  await Utils.delay(1000);
  const item = RealEstateCollection.find((item) => item.id == params.id);
  item.nearlys = RealEstateCollection;
  return {
    success: true,
    data: item,
  };
};
