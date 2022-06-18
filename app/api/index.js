import network from "@services/network";
import * as local from "./response";
import { store } from "@store";

// const endPoints = {
//   login: "index.php/wp-json/jwt-auth/v1/token",
// };

//const sitePath = 'http://192.168.1.73:8000';
//const sitePath = 'http://192.168.1.112:8000';
//192.168.1.112
//const sitePath = 'https://giftechies.com/directory';
const sitePath = 'http://easy2sell.ca';

const endPoints = {
    login: sitePath+"/api/login",
    logincheck:sitePath+"/api/logincheck",
    sendotp: sitePath+"/api/emailOrMobileOtp",
    sendresetotp: sitePath+"/api/emailOrMobileResetOtp",
    otpMatch:sitePath+"/api/otpMatch",
    resetOtpMatch:sitePath+"/api/resetOtpMatch",
    resetPassword:sitePath+"/api/resetPassword",
    signUp:sitePath+"/api/signUp",
    contactUs:sitePath+"/api/contactUs",
    home:sitePath+"/api/home",
    category:sitePath+"/api/getCategory",
    form_fields:sitePath+"/api/getFormFields",
    preference_fields:sitePath+"/api/getPreferenceFields",
    create_vehicle:sitePath+"/api/createVehicle",
    create_item:sitePath+"/api/createItem",
    create_coupon:sitePath+"/api/createCoupon",
    create_job:sitePath+"/api/createJob",
    create_construction:sitePath+"/api/createConstruction",
    create_realestate:sitePath+"/api/createRealEstate",
    change_password:sitePath+"/api/changePassword",
    updateProfile:sitePath+"/api/updateProfile",
    user_info:sitePath+"/api/userInfo",
    about:sitePath+"/api/aboutUs",
    propertydetail:sitePath+"/api/propertyDetail",
    listing:sitePath+"/api/listing",
    user_listing:sitePath+"/api/userListing",
    getWishlist:sitePath+"/api/getWishlist",
    addRemoveWish:sitePath+"/api/addRemoveWish",
    search:sitePath+"/api/search",
    searchhistory:sitePath+"/api/searchhistory",
    packages:sitePath+"/api/packages",
    itemcategories:sitePath+"/api/itemcategories",
    deletePost:sitePath+"/api/deletePost",
    postToEdit:sitePath+"/api/postItemToEdit",
    edit_realestate:sitePath+"/api/editRealEstate",
    edit_construction:sitePath+"/api/editConstruction",
    edit_coupon:sitePath+"/api/editCoupon",
    edit_job:sitePath+"/api/editJob",
    edit_vehicle:sitePath+"/api/editVehicle",
    edit_item:sitePath+"/api/editItem",
    getMessages:sitePath+"/api/getMessages",
    getGroupedMessages:sitePath+"/api/getGroupedMessages",
    receiveMessage:sitePath+"/api/receiveMessage",
    sendMessage:sitePath+"/api/sendMessage",
    deleteImage:sitePath+"/api/deleteImage",
    savePreference:sitePath+"/api/savePreference",
    getNotification:sitePath+"/api/getNotifications",
};

export const fetchLogin = (params) => {
    return network.post(endPoints.login, { params , headers:null , uniqueRequest:"login"});
};

export const contactUs = (params) => {
    return network.post(endPoints.contactUs, { params , headers:null , uniqueRequest:"contactUs"});
};

export const fetchValid = (params) => {
    return network.get(endPoints.logincheck, { params , headers:null , uniqueRequest:"login"});
};

export const about = (params) => {
    return network.get(endPoints.about, { params , headers:null , uniqueRequest:"about"});
};

export const sendMessage = (params) => {
    return network.post(endPoints.sendMessage, { params , headers:null , uniqueRequest:"sendMessage"});
};

export const receiveMessage = (params) => {
    return network.get(endPoints.receiveMessage, { params , headers:null , uniqueRequest:"receiveMessage"});
};

export const getMessages = (params) => {
    return network.get(endPoints.getMessages, { params , headers:null , uniqueRequest:"getMessages"});
};

export const getGroupedMessages = (params) => {
    return network.get(endPoints.getGroupedMessages, { params , headers:null , uniqueRequest:"getGroupedMessages"});
};

export const getItemCategories = (params) => {
    return network.get(endPoints.itemcategories, { params , headers:null , uniqueRequest:"itemcategories"});
};

export const getPackages = (params) => {
    return network.get(endPoints.packages, { params , headers:null , uniqueRequest:"packages"});
};

export const getSetting = (params) => {
    return local.getSetting({ params });
};

export const saveVehicle = (params,headers) => {
    return network.post(endPoints.create_vehicle, { params , headers:headers , uniqueRequest:"create_vehicle"});
};

export const editVehicle = (params,headers) => {
    return network.post(endPoints.edit_vehicle, { params , headers:headers , uniqueRequest:"edit_vehicle"});
};

export const saveItem = (params,headers) => {
    return network.post(endPoints.create_item, { params , headers:headers , uniqueRequest:"create_item"});
};

export const editItem = (params,headers) => {
    return network.post(endPoints.edit_item, { params , headers:headers , uniqueRequest:"edit_item"});
};

export const saveCoupon = (params,headers) => {
    return network.post(endPoints.create_coupon, { params , headers:headers , uniqueRequest:"create_coupon"});
};

export const editCoupon = (params,headers) => {
    return network.post(endPoints.edit_coupon, { params , headers:headers , uniqueRequest:"edit_coupon"});
};

export const saveRealEstate = (params,headers) => {
    return network.post(endPoints.create_realestate, { params , headers:headers , uniqueRequest:"create_realestate"});
};

export const editRealEstate = (params,headers) => {
    return network.post(endPoints.edit_realestate, { params , headers:headers , uniqueRequest:"edit_realestate"});
};

export const saveJob = (params,headers) => {
    return network.post(endPoints.create_job, { params , headers:headers , uniqueRequest:"create_job"});
};

export const editJob = (params,headers) => {
    return network.post(endPoints.edit_job, { params , headers:headers , uniqueRequest:"edit_job"});
};

export const saveConstruction = (params,headers) => {
    return network.post(endPoints.create_construction, { params , headers:headers , uniqueRequest:"create_construction"});
};

export const editConstruction = (params,headers) => {
    return network.post(endPoints.edit_construction, { params , headers:headers , uniqueRequest:"edit_construction"});
};

export const deletePost = (params,headers) => {
    return network.post(endPoints.deletePost, { params , headers:headers , uniqueRequest:"deletePost"});
};

export const deleteImage = (params) => {
    return network.post(endPoints.deleteImage, { params , headers:null , uniqueRequest:"deleteImage"});
};

export const savePreference = (params) => {
    return network.post(endPoints.savePreference, { params , headers:null , uniqueRequest:"savePreference"});
};


export const getPostToEdit = (params) => {
    return network.get(endPoints.postToEdit, { params , headers:null , uniqueRequest:"get_post_to_edit"});
};


export const signUp = (params) => {
    return network.post(endPoints.signUp, { params , headers:null , uniqueRequest:"sign_up"});
};

export const resetPassword = (params) => {
    return network.post(endPoints.resetPassword, { params , headers:null , uniqueRequest:"resetPassword"});
};

export const sendOtp = (params) => {
    return network.post(endPoints.sendotp, { params , headers:null , uniqueRequest:"send_otp"});
    
    //return local.sendOtp({params});
};

export const sendResetOtp = (params) => {
    return network.post(endPoints.sendresetotp, { params , headers:null , uniqueRequest:"sendresetotp"});
    
    //return local.sendOtp({params});
};

export const verifyOtp = (params) => {
    return network.post(endPoints.otpMatch, { params , headers:null , uniqueRequest:"verify_otp"});
};

export const verifyResetOtp = (params) => {
    return network.post(endPoints.resetOtpMatch, { params , headers:null , uniqueRequest:"resetOtpMatch"});
};

export const updateProfile = (params) => {
    return network.post(endPoints.updateProfile, { params , headers:null , uniqueRequest:"update_profile"});
};

export const getUserInfo = (params) => {
    return network.get(endPoints.user_info, { params , headers:null , uniqueRequest:"get_user_info"});
};
export const search = (params) => {
    return network.get(endPoints.search, { params , headers:null , uniqueRequest:"search"});
};

export const changePassword = (params) => {
    return network.post(endPoints.change_password, { params , headers:null , uniqueRequest:"change_password"});
};

export const getWishList = (params) => {
    return local.getWishList({ params });
};

export const getWishListRealEstate = (params) => {
    return network.get(endPoints.getWishlist, { params , headers:null , uniqueRequest:"get_wishlist"});
   //return local.getWishListRealEstate({ params });
};

export const getNotifications = (params) => {
    return network.get(endPoints.getNotification, { params , headers:null , uniqueRequest:"get_notifications"});
   //return local.getWishListRealEstate({ params });
};

export const addRemoveWish = (params) => {
    return network.get(endPoints.addRemoveWish, { params , headers:null , uniqueRequest:"add_remove_wishlist"});
   //return local.getWishListRealEstate({ params });
};

export const getWishListEvent = (params) => {
    return local.getWishListEvent({ params });
};

export const getWishListFood = (params) => {
    return local.getWishListFood({ params });
};

export const getHome = (params) => {
    return network.get(endPoints.home, { params , headers:null , uniqueRequest:"get_home"});;
};

export const getFormFields = (params={}) => {
    return network.get(endPoints.form_fields, { params , headers:null , uniqueRequest:"get_form_fields"});
};

export const getPreferenceFields = (params) => {
    return network.get(endPoints.preference_fields, { params , headers:null , uniqueRequest:"get_preference_fields"});
};

export const getHomeRealEstate = (params) => {
    return local.getHomeRealEstate({ params });
};

export const getHomeEvent = (params) => {
    return local.getHomeEvent({ params });
};

export const getHomeFood = (params) => {
    return local.getHomeFood({ params });
};

export const getProductDetail = (params) => {
    return network.get(endPoints.propertydetail, { params , headers:null , uniqueRequest:"get_propertydetail"});
};

export const getListing = (params) => {
    return network.get(endPoints.listing, { params , headers:null , uniqueRequest:"get_listing"});
};

export const getUserListing = (params) => {
    return network.get(endPoints.user_listing, { params , headers:null , uniqueRequest:"get_user_listing"});
};

export const getProductDetailRealEstate = (params) => {
    return local.getProductDetailRealEstate({ params });
};

export const getProductDetailEvent = (params) => {
    return local.getProductDetailEvent({ params });
};

export const getProductDetailFood = (params) => {
    return local.getProductDetailFood({ params });
};

export const getReview = (params) => {
    return local.getReview({ params });
};

export const saveReview = (params) => {
    return local.getReview({ params });
};

export const getCategory = (params) => {
    return network.get(endPoints.category, { params , headers:null , uniqueRequest:"get_categories"});
};

export const listingCategories = (params) => {
    return network.get(endPoints.category, { params , headers:null , uniqueRequest:"get_listing_categories"});
};

export const getListProduct = (params) => {
    return local.getList({ params });
};

export const getListProductEvent = (params) => {
    return local.getListEvent({ params });
};

export const getListProductRealEstate = (params) => {
    return local.getListRealEstate({ params });
};

export const getListProductFood = (params) => {
    return local.getListFood({ params });
};

export const getMessage = (params) => {
    return local.getMessage({ params });
};

export const getNotification = (params) => {
    return local.getNotification({ params });
};