import { AdvertisementModel, CategoryBanners } from "../interfaces/advertisement.interface";
import {
  AdvertisementPointSetting,
  AdvertisementSettings,
  RequestData,
  ResponseData,
} from "../interfaces/interfaces";
import { ApiService } from "./api.service";

export class AdvertisementService {
  // Singletone
  private static _instance: AdvertisementService;
  public static get instance(): AdvertisementService {
    if (!AdvertisementService._instance) {
      AdvertisementService._instance = new AdvertisementService();
    }
    return AdvertisementService._instance;
  }

  api = ApiService.instance;
  //

  private _advertisementSettings?: AdvertisementSettings;
  //
  private categoryBanners: CategoryBanners = {};

  /**
   * Get banners from backend.
   *
   * @attention it does memory cache.
   * @param cafeDomain cafe domain to get the banners of
   * @returns banner data
   */
  async loadBanners(cafeDomain: string): Promise<CategoryBanners> {
    // console.log("loadBanners");
    if (this.categoryBanners.keys?.length) return this.categoryBanners;

    const res = await this.api.request("advertisement.loadBanners", {
      cafeDomain: cafeDomain,
    });
    const banners: AdvertisementModel[] = res.map((post: JSON) =>
      new AdvertisementModel().fromJson(post)
    );

    const _banners: CategoryBanners = {};
    if (banners && banners.length) {
      for (const banner of banners) {
        if (!_banners[banner.subcategory]) _banners[banner.subcategory] = {};
        if (!_banners[banner.subcategory][banner.code]) {
          _banners[banner.subcategory][banner.code] = [];
        }

        _banners[banner.subcategory][banner.code].push({
          bannerUrl: banner.bannerUrl,
          clickUrl: banner.clickUrl,
          idx: banner.idx,
          title: banner.title ?? "",
        });
      }
    }

    this.categoryBanners = _banners;
    // console.log("loadBanners", this.categoryBanners);
    return this.categoryBanners;
  }

  async advertisementSearch(options: RequestData): Promise<Array<AdvertisementModel>> {
    const res = await this.api.request("advertisement.search", options);
    return res.map((post: JSON) => new AdvertisementModel().fromJson(post));
  }

  async advertisementGet(data: RequestData): Promise<AdvertisementModel> {
    const res = await this.api.request("advertisement.get", data);
    return new AdvertisementModel().fromJson(res);
  }

  async advertisementEdit(data: RequestData): Promise<AdvertisementModel> {
    const res = await this.api.request("advertisement.edit", data);
    return new AdvertisementModel().fromJson(res);
  }

  /**
   * Gets the global advertisement settings.
   *
   * @usage
   *  - Get advertisement settings only if the app is using advertisement functionality.
   *
   * @attention It does memory cache. Meaning, it will only connect to backend to get data,
   *    no matter how many times you call this method.
   *
   * @returns Promise<ResponseData>
   */
  async advertisementSettings(): Promise<AdvertisementSettings> {
    if (this._advertisementSettings) return this._advertisementSettings;
    this._advertisementSettings = (await this.api.request(
      "advertisement.settings"
    )) as AdvertisementSettings;
    return this._advertisementSettings;
  }

  /**
   * It creates or updates the banner point settings.
   *
   * @param data data to create (or update) the banner point settings.
   * @returns ...
   */
  async advertisementSetBannerPoint(data: RequestData): Promise<ResponseData> {
    return await this.api.request("advertisement.setBannerPoint", data);
  }

  async advertisementDeleteBannerPoint(idx: string): Promise<ResponseData> {
    return await this.api.request("advertisement.deleteBannerPoint", { idx });
  }

  /**
   *
   * @returns
   */
  async advertisementGetBannerPoints(): Promise<Array<AdvertisementPointSetting>> {
    return (await this.api.request(
      "advertisement.getBannerPoints"
    )) as Array<AdvertisementPointSetting>;
  }

  async advertisementStart(data: RequestData): Promise<AdvertisementModel> {
    const res = await this.api.request("advertisement.start", data);
    return new AdvertisementModel().fromJson(res);
  }

  async advertisementStop(idx: number): Promise<AdvertisementModel> {
    const res = await this.api.request("advertisement.stop", { idx: idx });
    return new AdvertisementModel().fromJson(res);
  }

  async advertisementDelete(idx: number): Promise<AdvertisementModel> {
    const res = await this.api.request("advertisement.delete", { idx: idx });
    return new AdvertisementModel().fromJson(res);
  }
}