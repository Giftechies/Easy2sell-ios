import { Images } from "@config";
import * as Utils from "@utils";

import { RealEstateCollection } from "./collection";

export const getHomeRealEstate = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: {
      countrys: [
        {
          value: "america",
          icon: "sort-amount-up",
          text: "United States",
          image: Images.us,
        },
        {
          value: "vietname",
          icon: "sort-amount-down",
          text: "VietNam",
          image: Images.vn,
        },
        {
          value: "singapore",
          icon: "sort-amount-up",
          text: "Singapore",
          image: Images.sg,
        },
        {
          value: "indonesia",
          icon: "sort-amount-up",
          text: "Indonesia",
          image: Images.id,
        },
        {
          value: "malaysia",
          icon: "sort-amount-up",
          text: "Malaysia",
          image: Images.my,
        },
        {
          value: "philippines",
          icon: "sort-amount-up",
          text: "Philippines",
          image: Images.ph,
        },
      ],
      locations: [
        { title: "New York", image: Images.place1 },
        { title: "Michigan", image: Images.place2 },
        { title: "Nevada", image: Images.place3 },
        { title: "New York", image: Images.place4 },
        { title: "California", image: Images.place5 },
      ],
      populars: [
        RealEstateCollection[0],
        RealEstateCollection[1],
        RealEstateCollection[2],
        RealEstateCollection[3],
      ],
      recommends: [
        RealEstateCollection[4],
        RealEstateCollection[5],
        RealEstateCollection[6],
        RealEstateCollection[7],
      ],
    },
  };
};
