import * as Utils from "@utils";
import { RealEstateCollection } from "./collection";

export const getListRealEstate = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: RealEstateCollection,
  };
};
