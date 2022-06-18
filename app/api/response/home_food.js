import * as Utils from "@utils";
import { FoodCollection } from "./collection";
import { Images } from "@config";

export const getHomeFood = async ({ params }) => {
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
      sliders: [FoodCollection[0], FoodCollection[1], FoodCollection[2]],
      categories: [
        { title: "Pizza", image: Images.food6 },
        { title: "Fastfood", image: Images.food8 },
        { title: "Drink", image: Images.food7 },
        { title: "Fruits", image: Images.food4 },
        { title: "Vegetable", image: Images.food1 },
        { title: "Restaurants", image: Images.food5 },
      ],
      recommends: [FoodCollection[2], FoodCollection[1], FoodCollection[0]],
      banner: { title: "Promotions Today", image: Images.foodPromos },
      locations: [
        FoodCollection[3],
        FoodCollection[4],
        FoodCollection[5],
        FoodCollection[6],
      ],
    },
  };
};
