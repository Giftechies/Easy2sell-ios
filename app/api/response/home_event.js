import * as Utils from "@utils";
import { EventCollection } from "./collection";

export const getHomeEvent = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: {
      categories: [
        { title: "Music", icon: "music", color: "#A569BD" },
        { title: "Shows", icon: "star", color: "#5DADE2" },
        { title: "Sports", icon: "futbol", color: "#58D68D" },
        { title: "Events", icon: "bullseye", color: "#5D6D7E" },
        { title: "Out Door", icon: "snowboarding", color: "#5DADE2" },
      ],
      features: [
        EventCollection[3],
        EventCollection[5],
        EventCollection[4],
        EventCollection[0],
      ],
      news: [
        EventCollection[1],
        EventCollection[2],
        EventCollection[6],
        EventCollection[7],
      ],
    },
  };
};
