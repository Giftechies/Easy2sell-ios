
export default class UserNewModel {
    constructor(json) {
      this.id = json?.id;
      this.name = json?.name;
      this.nickname = json?.name;
      this.image = json?.user_photo;
      this.mobile = json?.mobile??'';
      this.address = json?.address;
      this.level = json?.user_level;
      this.description = json?.description;
      this.tag = json?.tag;
      this.rate = json?.rate;
      this.token = json?.api_token;
      this.email = json?.email??'';
      this.role = json?.role;
      this.location = json?.location??'';
      this.city = json?.city??'';
      this.state = json?.state??'';
      this.country = json?.country??'';
      this.latitude = json?.latitude??'';
      this.longitude = json?.longitude??'';
      this.value = json?.value;
    }
  }