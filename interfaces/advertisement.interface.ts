import { PostModel } from "./forum.interface";
import { RequestData, ResponseData } from "./interfaces";

export interface Banner {
  idx?: number;
  bannerUrl?: string;
  clickUrl?: string;
  title?: string;
}

export interface Banners {
  [code: string]: Banner[];
}
export interface CategoryBanners {
  [category: string]: Banners;
}
export class AdvertisementModel extends PostModel {
  advertisementPoint = 0;
  status = "";

  get isActive(): boolean {
    return this.status == "active";
  }
  get isInactive(): boolean {
    return this.status == "inactive";
  }
  get isWaiting(): boolean {
    return this.status == "waiting";
  }

  bannerUrl = "";
  clickUrl = "";
  subcategory = "";

  fromJson(map: ResponseData): AdvertisementModel {
    this.advertisementPoint = map.advertisementPoint ?? 0;
    this.status = map.status ?? "";
    this.bannerUrl = map.bannerUrl;
    this.clickUrl = map.clickUrl ?? "";
    this.subcategory = map.subcategory ?? "";
    super.fromJson(map);
    return this;
  }

  get toJson(): RequestData {
    return {
      idx: this.idx,
      userIdx: this.userIdx,
      categoryId: this.categoryId,
      categoryIdx: this.categoryIdx,
      title: this.title,
      content: this.content,
      privateTitle: this.privateTitle,
      privateContent: this.privateContent,
      subcategory: this.subcategory,

      // Advertisement properties
      name: this.name,
      companyName: this.companyName,
      phoneNo: this.phoneNo,
      code: this.code,
      countryCode: this.countryCode,
      beginDate: this.beginDate,
      endDate: this.endDate,
      files: this.fileIdxes,
      clickUrl: this.clickUrl,
    };
  }
}
