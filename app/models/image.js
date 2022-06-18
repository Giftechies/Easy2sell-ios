export default class ImageModel {
  constructor(json) {
    this.full = json?.full?.url;
    this.thump = json?.thumb?.url;
  }
}
