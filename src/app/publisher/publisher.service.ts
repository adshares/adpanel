import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { Site, AdUnitSize } from '../models/site.model';
import { TargetingOption } from '../models/targeting-option.model';
import { prepareTargetingChoices, parseTargetingForBackend } from '../common/components/targeting/targeting.helpers';
import { cloneDeep } from '../common/utilities/helpers';

@Injectable()
export class PublisherService {

  constructor(private http: HttpClient) {}

  getSites(userId: number): Observable<Site[]> {
    return this.http.get(`${environment.apiUrl}/sites/${userId}`)
      .map((sites: Site[]) => sites);
  }

  getSite(id: number): Observable<Site> {
    return this.http.get(`${environment.apiUrl}/site/${id}`)
      .map((site: Site) => site);
  }

  saveSite(site: Site): Observable<Site> {
    const targetingObject = parseTargetingForBackend(site.targetingArray);

    Object.assign(site, {targeting: targetingObject});

    return this.http.put(`${environment.apiUrl}/site`, { site })
      .map((site: Site) => site);
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get(`${environment.apiUrl}/site_targeting`)
      .map((targetingOptions: TargetingOption[]) => {
        prepareTargetingChoices(targetingOptions);

        return targetingOptions;
      });
  }

  getAdUnitSizes(): Observable<AdUnitSize[]> {
    return this.http.get(`${environment.apiUrl}/ad_unit_sizes`)
      .map((adUnitSizes: AdUnitSize[]) => adUnitSizes);
  }
}
