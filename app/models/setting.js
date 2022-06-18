import SortModel from "./sort";
import CategoryModel from "./category";
import CategoryNewModel from "./category_new";

export default class SettingModel {
  constructor(json) {
    this.mode = json?.settings?.list_mode ?? 'grid';
    this.color = json?.settings?.color_option;
    this.perPage = json?.settings?.per_page;
    this.priceMin = json?.min_price;
    this.priceMax = json?.max_price;
    this.timeMin = json?.settings?.time_min;
    this.timeMax = json?.settings?.time_max;
    this.unitPrice = json?.settings?.unit_price;
    this.conditions = json?.conditions;
    this.propertytypes = json?.propertytypes;
    this.availablefor = json?.availablefor;
    this.jobtypes = json?.jobtypes;
    this.priceTitle = json?.price_title;
    this.categories = json?.categories?.map?.((item) => {
      return new CategoryNewModel(item);
    });
    this.features = json?.features?.map?.((item) => {
      return new CategoryModel(item);
    });
    this.locations = json?.locations?.map?.((item) => {
      return new CategoryModel(item);
    });
    this.sortOption = json?.place_sort_option?.map?.((item) => {
      return new SortModel(item);
    });
  }
}
