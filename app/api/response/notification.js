import { Images } from "@config";
import * as Utils from "@utils";

export const getNotification = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: [
      {
        id: "0",
        title: "Sankhadeep",
        description: "Its time to build a difference ...",
        image: Images.avata1,
        time: "Dec 11, 2019",
      },
      {
        id: "1",
        title: "Sankhadeep",
        description: "Its time to build a difference ...",
        image: Images.avata2,
        time: "Dec 11, 2019",
      },
      {
        id: "2",
        title: "Sankhadeep",
        description: "Its time to build a difference ...",
        image: Images.avata3,
        time: "Dec 11, 2019",
      },
      {
        id: "3",
        title: "Sankhadeep",
        description: "Its time to build a difference ...",
        image: Images.avata4,
        time: "Dec 11, 2019",
      },
      {
        id: "4",
        title: "Sankhadeep",
        description: "Its time to build a difference ...",
        image: Images.profile1,
        time: "Dec 11, 2019",
      },
      {
        id: "5",
        title: "Sankhadeep",
        description: "Its time to build a difference ...",
        image: Images.profile3,
        time: "Dec 11, 2019",
      },
    ],
  };
};
