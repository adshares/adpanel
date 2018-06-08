import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { Site, SitesTotals, AdUnitSize } from 'models/site.model';
import { TargetingOption } from 'models/targeting-option.model';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

@Injectable()
export class PublisherService {

  constructor(private http: HttpClient) {}

  getSites(timespan: TimespanFilter): Observable<Site[]> {
    return this.http.get<Site[]>(`${environment.apiUrl}/sites`);
  }

  getSitesTotals(timespan: TimespanFilter): Observable<SitesTotals> {
    return this.http.post<SitesTotals>(`${environment.apiUrl}/sites_totals`, { timespan });
  }

  getSite(id: number): Observable<Site> {
    return this.http.get<Site>(`${environment.apiUrl}/site/${id}`);
  }

  saveSite(site: Site): Observable<Site> {
    if (site.targetingArray) {
      const targetingObject = parseTargetingForBackend(site.targetingArray);

      Object.assign(site, {targeting: targetingObject});
    }
    return this.http.post<Site>(`${environment.apiUrl}/sites`, { site });
  }

  saveSitePatch(site: Site): Observable<Site> {
        if (site.targetingArray) {
            const targetingObject = parseTargetingForBackend(site.targetingArray);

            Object.assign(site, {targeting: targetingObject});
        }
        return this.http.patch<Site>(`${environment.apiUrl}/sites`, { site });
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/sites/targeting`);
  }

  getAdUnitSizes(): Observable<AdUnitSize[]> {
    return this.http.get<AdUnitSize[]>(`${environment.apiUrl}/config/banners`);
  }
}
