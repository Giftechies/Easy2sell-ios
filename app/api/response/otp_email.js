import * as Utils from "@utils";

export const sendOtp = async({ params }) => {
    await Utils.delay(1000);
    return {
        success: true,
        message: "register_success",
    };
};

export const verifyOtp = async({ params }) => {
    await Utils.delay(1000);
    return {
        success: true,
        message: "register_success",
    };
};