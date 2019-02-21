import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {Router} from "@angular/router";

import {environment} from 'environments/environment';
import {AdUnitSize, Site, SiteLanguage, SitesTotals} from 'models/site.model';
import {TargetingOption} from 'models/targeting-option.model';
import {parseTargetingForBackend} from 'common/components/targeting/targeting.helpers';
import * as publisherActions from "store/publisher/publisher.actions";
import {AppState} from "models/app-state.model";
import {MatDialog} from "@angular/material";
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";
import {siteStatusEnum} from "models/enum/site.enum";
import {BannerClassification} from 'models/classifier.model';
import * as codes from 'common/utilities/codes';

@Injectable()
export class PublisherService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog
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

  getSite(id: number): Observable<Site> {
    return this.http.get<Site>(`${environment.apiUrl}/sites/${id}`);
  }

  saveSite(site: Site): Observable<Site> {
    if (site.filteringArray) {
      const targetingObject = parseTargetingForBackend(site.filteringArray);
      Object.assign(site, {filtering: targetingObject});
    }

    return this.http.post<Site>(`${environment.apiUrl}/sites`, {site});
  }

  deleteSite(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/sites/${id}`);
  }

  updateSiteData(id: number, site: Site): Observable<Site> {
    return this.http.patch<Site>(`${environment.apiUrl}/sites/${id}`, {site});
  }

  updateSiteStatus(id: number, status: number): Observable<number> {
    return this.http.put<number>(`${environment.apiUrl}/sites/${id}/status`, {status});
  }

  updateSiteFiltering(id: number, site: Site): Observable<Site> {
    if (site.filteringArray) {
      const targetingObject = parseTargetingForBackend(site.filteringArray);

      Object.assign(site, {filtering: targetingObject});
    }

    return this.http.patch<Site>(`${environment.apiUrl}/sites/${id}`, {site});
  }

  getFilteringCriteria(): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/options/sites/filtering`);
  }

  getAdUnitSizes(): Observable<AdUnitSize[]> {
    return this.http.get<AdUnitSize[]>(`${environment.apiUrl}/options/sites/zones`);
  }

  saveAsDraft(site: Site): void {
    site = {
      ...site,
      status: siteStatusEnum.DRAFT
    };

    this.saveSite(site).subscribe(
      () => {
        this.store.dispatch(new publisherActions.AddSiteToSitesSuccess(site));
        this.store.dispatch(new publisherActions.ClearLastEditedSite({}));
        this.router.navigate(['/publisher', 'dashboard']);
      },
      (err) => {
        if (err.status === codes.HTTP_INTERNAL_SERVER_ERROR) return;
        this.dialog.open(ErrorResponseDialogComponent, {
          data: {
            title: 'Ups! Something went wrong...',
            message: `We weren\'t able to save your site due to this error: ${err.error.message} \n Please try again later.`,
          }
        });
      }
    );
  }

  getBannerClassification(siteId?: number, limit?: number, offset?: number): Observable<BannerClassification[]> {
    const params = {};
    if (limit) {
      params['limit'] = `${limit}`;
    }
    if (offset) {
      params['offset'] = `${offset}`;
    }

    return this.http.get<BannerClassification[]>(`${environment.apiUrl}/classifications/${siteId || ''}`, {params: params});
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
