import * as Utils from "@utils";
import { EventCollection } from "./collection";

export const getListEvent = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: EventCollection,
  };
};
