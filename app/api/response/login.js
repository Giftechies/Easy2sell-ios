import { Images } from "@config";
import * as Utils from "@utils";

export const login = async ({ params }) => {
  await Utils.delay(1000);
  if (params.username == "paul" && params.password == "123456") {
    return {
      success: true,
      data: {
        display_name: "Paul",
        user_nicename: "paul",
        user_photo: Images.profile2,
        user_url: "passionui.com",
        user_level: "Developer",
        description: "Better and better",
        tag: "passionui",
        rate: 5,
        token: "token",
        user_email: "passionui@gmail.com",
        value: [
          { value: "97.01%", title: "feedback" },
          { value: "999", title: "items" },
          { value: "120k", title: "followers" },
        ],
      },
    };
  }

  return {
    success: false,
    message: "confirm_password_not_corrent",
  };
};
