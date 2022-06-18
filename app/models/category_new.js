
export default class CategoryNewModel {
  constructor(json) {
    this.id = json?.id;
    this.title = json?.name;
    this.count = json?.count;
    this.image = json?.image ? json?.image : null;
    this.icon = json?.icon;
    this.color = json?.color;
    this.type = this.exportType(json?.type);
  }

  exportType(type) {
    switch (type) {
      case "feature":
        return "feature";
      case "location":
        return "location";
      default:
        return "category";
    }
  }
}
