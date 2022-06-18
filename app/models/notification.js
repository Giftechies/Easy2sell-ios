export default class NotificationModel {
  constructor(json) {
    this.id = json?.id;
    this.title = json?.title;
    this.description = json?.description;
    this.image = json?.image;
    this.time = json.time;
  }
}
