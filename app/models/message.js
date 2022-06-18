export default class MessengerModel {
  constructor(json) {
    this.id = json?.id;
    this.name = json?.name;
    this.message = json?.message;
    this.image = json?.image;
    this.time = json.time;
  }
}
