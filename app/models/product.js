import CategoryNewModel from "./category";
import LocationModel from "./location";
import UserNewModel from "./user";
import OpenTimeModel from "./open_time";

export default class ProductModel {
  constructor(json) {
    this.id = json?.id?.toString();
    this.title = json?.title;
    this.author = json?.author ? new UserNewModel(json?.author) : null;
    this.image = json?.image ? json?.image : null;
    this.category = json?.category ? new CategoryNewModel(json?.category) : null;
    this.category_name = json?.category_name ;
    this.createDate = json?.created_at;
    this.dateEstablish = json?.dateEstablished;
    this.rate = json?.rating_avg;
    this.numRate = json?.rating_count;
    this.rateText = json?.post_status;
    this.status = json?.status;
    this.favorite = json?.wishlist;
    this.address = json?.location;
    this.phone = json?.phone;
    this.fax = json?.fax;
    this.email = json?.contact_email;
    this.website = json?.website;
    this.description = json?.description;
    this.latitude = json?.latitude;
    this.longitude = json?.longitude;
    this.price = json?.price?.toString()??(json?.minimum_salary ? (json?.minimum_salary?.toString()+(json?.maximum_salary?'-':'')+json?.maximum_salary?.toString()):null) ??'';
    //this.price = json?.price?.toString()??(json?.minimum_salary ? (json?.minimum_salary?.toString()+(json?.maximum_salary?'-':'')+json?.maximum_salary?.toString()):null);
    this.priceMin = json?.price_min;
    this.priceMax = json?.price_max;
    this.link = json?.guid;
    this.user = json?.user;
    this.location = json?.location;
    this.property_type = json?.property_type??json?.category_name;

    /*only property fields */
    this.available_for = json?.available_for;
    this.builtup_area = json?.builtup_area;
    this.carpet_area = json?.carpet_area;
    this.actype = json?.actype;
    this.bedrooms = json?.bedrooms;
    this.bathrooms = json?.bathrooms;
    this.listed_by = json?.listed_by;
    this.home_amenities = json?.home_amenities;
    
    /*only property fields end*/

    /*only coupon fields */
    this.referral_url = json?.referral_url;
    this.code = json?.code;
    this.type = json?.type;
    this.start_date = json?.start_date;
    this.expiry_date = json?.expiry_date;
    /*only coupon fields end*/

    /*only vehicle fields */
    this.tags = json?.tags;
    /*only vehicle fields end*/

    /*only item fields */
    this.qty = json?.qty;
    this.condition = json?.condition;
    /*only item fields end*/

    /*only job fields */
    this.salary_type = json?.salary_type;
    this.job_type = json?.job_type;
    /*only job fields end*/



    this.openTime = json?.opening_hour?.map?.((item) => {
      return new OpenTimeModel(item);
    });
    this.gallery = json?.photos?.map?.((item) => {
      return item;
    });
    this.features = json?.amenities?.map?.((item) => {
      return new CategoryNewModel(item);
    });
    this.related = json?.related?.map?.((item) => {
      return new ProductModel(item);
    });
    this.lastest = json?.lastest?.map?.((item) => {
      return new ProductModel(item);
    });
    this.geo = new LocationModel({
      name: json?.title,
      latitude: json?.latitude,
      longitude: json?.longitude,
    });
  }
}
