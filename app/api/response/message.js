import { Images } from "@config";
import * as Utils from "@utils";

export const getMessage = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: [
      {
        id: "0",
        name: "Sankhadeep",
        message: "Its time to build a difference ...",
        image: Images.avata1,
        time: "Dec 11, 2019",
      },
      {
        id: "1",
        name: "Sankhadeep",
        message: "Its time to build a difference ...",
        image: Images.avata2,
        time: "Dec 11, 2019",
      },
      {
        id: "2",
        name: "Sankhadeep",
        message: "Its time to build a difference ...",
        image: Images.avata3,
        time: "Dec 11, 2019",
      },
      {
        id: "3",
        name: "Sankhadeep",
        message: "Its time to build a difference ...",
        image: Images.avata4,
        time: "Dec 11, 2019",
      },
      {
        id: "4",
        name: "Sankhadeep",
        message: "Its time to build a difference ...",
        image: Images.profile1,
        time: "Dec 11, 2019",
      },
      {
        id: "5",
        name: "Sankhadeep",
        message: "Its time to build a difference ...",
        image: Images.profile3,
        time: "Dec 11, 2019",
      },
    ],
  };
};
