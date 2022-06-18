import * as Utils from "@utils";

export const signUp = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    message: "register_success",
  };
};
