import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { AdUnitSize, Site, SiteLanguage, SitesTotals } from 'models/site.model';
import { TargetingOption } from 'models/targeting-option.model';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { BannerClassificationFilters, BannerClassificationResponse } from 'models/classifier.model';

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

    // const options = siteId > 0 && {
    //   params: {site_id: `${siteId}`}
    // };


    return this.http.get<any>(`${environment.apiUrl}/sites/stats/report/${dateStart}/${dateEnd}`, options);
  }

  getSite(id: number): Observable<Site> {
    return this.http.get<Site>(`${environment.apiUrl}/sites/${id}`);
  }

  saveSite(site: Site): Observable<Site> {
    if (site.filteringArray) {
      const targetingObject = parseTargetingForBackend(site.filteringArray);
      Object.assign(site, {filtering: targetingObject});
    }
    const {filteringArray, ...reducedSite} = site;

    return this.http.post<Site>(`${environment.apiUrl}/sites`, {site: reducedSite});
  }

  deleteSite(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/sites/${id}`);
  }

  updateSiteData(id: number, site: Site): Observable<Site> {
    const {filteringArray, ...reducedSite} = site;

    return this.http.patch<Site>(`${environment.apiUrl}/sites/${id}`, {site: reducedSite});
  }

  updateSiteStatus(id: number, status: number): Observable<number> {
    return this.http.patch<number>(`${environment.apiUrl}/sites/${id}/status`, {status});
  }

  getFilteringCriteria(): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/options/sites/filtering`);
  }

  getAdUnitSizes(): Observable<AdUnitSize[]> {
    return this.http.get<AdUnitSize[]>(`${environment.apiUrl}/options/sites/zones`);
  }

  getPossibleSizeOptionForBannerClassification(siteId?: number): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/sites/sizes/${siteId || ''}`);
  }

  getBannerClassification(
    siteId?: number, limit?: number, filtering?: BannerClassificationFilters, possibleSizes: string[] = [], offset?: number)
    : Observable<BannerClassificationResponse> {
    let params = {};
    if (limit) {
      params['limit'] = `${limit}`;
    }
    if (offset) {
      params['offset'] = `${offset}`;
    }
    if (filtering) {
      params = {
        ...params,
        ...filtering.status,
        sizes: (!!filtering.sizes && filtering.sizes.length) ? JSON.stringify(filtering.sizes)
          : JSON.stringify(possibleSizes)
      };
    }

    return this.http.get<BannerClassificationResponse>(`${environment.apiUrl}/classifications/${siteId || ''}`,
      {params});
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
}
