import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AdUnitMetaData, Site, SiteLanguage, SiteRank, SitesTotals } from 'models/site.model';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { Media, Medium } from 'models/taxonomy-medium.model';
import { parseTargetingForBackend, processTargeting } from 'common/components/targeting/targeting.helpers';
import { BannerClassificationFilters, BannerClassificationResponse } from 'models/classifier.model';
import { AdminSiteOptions } from 'models/settings.model'

@Injectable()
export class PublisherService {

  constructor(
    private http: HttpClient
  ) {
  }

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${environment.apiUrl}/sites`);
  }

  getLanguagesList(): Observable<SiteLanguage[]> {
    return this.http.get<SiteLanguage[]>(`${environment.apiUrl}/options/sites/languages`);
  }

  getSitesTotals(dateStart: string, dateEnd: string, siteId?: number): Observable<SitesTotals[]> {
    const options = siteId > 0 && {
      params: {site_id: `${siteId}`}
    };
    return this.http.get<SitesTotals[]>(`${environment.apiUrl}/sites/stats/table2/${dateStart}/${dateEnd}`, options);
  }

  report(dateStart: string, dateEnd: string, siteId?: number): Observable<SitesTotals[]> {
    let options = {
      responseType: 'blob' as 'json'
    };

    if (siteId > 0) {
      options['params'] = {
        site_id: siteId
      };
    }

    return this.http.get<any>(`${environment.apiUrl}/sites/stats/report/${dateStart}/${dateEnd}`, options);
  }

  getSite(id: number): Observable<Site> {
    return this.http.get<Site>(`${environment.apiUrl}/sites/${id}`);
  }

  getSiteRank(id: number): Observable<SiteRank> {
    return this.http.get<SiteRank>(`${environment.apiUrl}/sites/${id}/rank`);
  }

  saveSite(site: Site): Observable<Site> {
    if (site.filteringArray) {
      const targetingObject = parseTargetingForBackend(site.filteringArray);
      Object.assign(site, {filtering: targetingObject});
    }
    const {filteringArray, ...reducedSite} = site;

    return this.http.post<Site>(`${environment.apiUrl}/sites`, {site: reducedSite});
  }

  validateDomain(domain: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/sites/domain/validate`, {domain});
  }

  deleteSite(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/sites/${id}`);
  }

  updateSiteData(id: number, site: Site): Observable<Site> {
    const {filteringArray, ...reducedSite} = site;

    return this.http.patch<Site>(`${environment.apiUrl}/sites/${id}`, {site: reducedSite});
  }

  getFilteringCriteria(excludeInternal: boolean = false): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/options/sites/filtering?e=${excludeInternal ? 1 : 0}`);
  }

  private getMedium(medium: string = 'web', vendor: string | null = null, excludeInternal: boolean = true): Observable<Medium> {
    let url = `${environment.apiUrl}/options/campaigns/media/${medium}?e=${excludeInternal ? 1 : 0}`
    if (vendor) {
      url = `${url}&vendor=${vendor}`
    }
    return this.http.get<Medium>(url)
  }

  getMediumVendors(medium: string): Observable<Media> {
    return this.http.get<Media>(`${environment.apiUrl}/options/campaigns/media/${medium}/vendors`);
  }

  siteCategoriesOptions(mediumName: string, vendor: string | null = null, excludeInternal: boolean = true): Observable<TargetingOptionValue[]> {
    return this.getMedium(mediumName, vendor, excludeInternal)
      .pipe(
        map(medium => PublisherService.extractSiteCategoriesFromMedium(medium))
      );
  }

  private static extractSiteCategoriesFromMedium (medium: Medium) {
    const targetingOptions = processTargeting(medium)

    const siteOption = targetingOptions.find(option => 'site' === option.key)
    if (!siteOption) {
      return []
    }

    const categoryOption = siteOption.children.find(option => 'category' === option.key)
    if (!categoryOption) {
      return []
    }

    return categoryOption.values
  }

  getAdUnitSizes(): Observable<AdUnitMetaData[]> {
    return this.http.get<AdUnitMetaData[]>(`${environment.apiUrl}/options/sites/zones`);
  }

  getPossibleSizeOptionForBannerClassification(siteId?: number): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/sites/sizes/${siteId || ''}`);
  }

  getBannerClassification(
    siteId?: number,
    limit?: number,
    filtering?: BannerClassificationFilters,
    possibleSizes: string[] = [],
    local?: number,
    offset?: number,
  )
    : Observable<BannerClassificationResponse> {
    let params = {};
    if (limit) {
      params['limit'] = `${limit}`;
    }
    if (offset) {
      params['offset'] = `${offset}`;
    }
    if (filtering.bannerId) {
      params['bannerId'] = filtering.bannerId;
    }
    if (filtering) {
      params = {
        ...params,
        ...filtering.status,
        sizes: (!!filtering.sizes && filtering.sizes.length) ? JSON.stringify(filtering.sizes)
          : JSON.stringify(possibleSizes),
        landingUrl: filtering.landingUrl || '',
        local: filtering.classifierLocalBanners
      };
    }
    return this.http.get<BannerClassificationResponse>(`${environment.apiUrl}/classifications/${siteId || ''}`,
      {params});
  }

  getSiteOptions(): Observable<AdminSiteOptions>{
    return this.http.get<AdminSiteOptions>(`${environment.apiUrl}/options/sites`)
  }

  setBannerClassification(bannerId: number, status: boolean, siteId?: number): Observable<number> {
    const body = {
      classification: {
        banner_id: bannerId,
        status: status,
      }
    };

    return this.http.patch<number>(`${environment.apiUrl}/classifications/${siteId || ''}`, body);
  }

  getSiteCodes(siteId: number, options): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/sites/${siteId}/codes`, {params: options});
  }

  getCryptovoxelsCode (): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/sites/cryptovoxels/code`)
  }
}
