import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { processTargeting } from 'common/components/targeting/targeting.helpers';
import { BidStrategy, BidStrategyRequest, BidStrategyUuidDefaultResponse } from 'models/campaign.model';
import { TargetingOption } from 'models/targeting-option.model';
import { Media, Medium } from 'models/taxonomy-medium.model';

@Injectable()
export class BidStrategyService {
  constructor(private http: HttpClient) {}

  getTargetingCriteria(medium: string = 'web', vendor: string | null = null): Observable<TargetingOption[]> {
    let url = `${environment.apiUrl}/options/campaigns/media/${medium}`;
    if (vendor) {
      url = `${url}?vendor=${vendor}`;
    }
    return this.http.get<Medium>(url).pipe(map(mediumObject => processTargeting(mediumObject)));
  }

  getMediumVendors(medium: string): Observable<Media> {
    return this.http.get<Media>(`${environment.apiUrl}/options/campaigns/media/${medium}/vendors`);
  }

  getBidStrategies(
    medium: string = 'web',
    vendor: string | null = null,
    attachDefault: boolean = false
  ): Observable<BidStrategy[]> {
    let url = `${environment.apiUrl}/campaigns/bid-strategy/media/${medium}`;
    if (vendor) {
      url = `${url}?vendor=${vendor}`;
    }
    const params = {};
    if (attachDefault) {
      params['attach-default'] = 'true';
    }

    return this.http.get<BidStrategy[]>(url, { params });
  }

  putBidStrategy(
    bidStrategy: BidStrategyRequest,
    medium: string = 'web',
    vendor: string | null = null
  ): Observable<any> {
    let url = `${environment.apiUrl}/campaigns/bid-strategy/media/${medium}`;
    if (vendor) {
      url = `${url}?vendor=${vendor}`;
    }

    return this.http.put<any>(url, bidStrategy);
  }

  patchBidStrategy(uuid: string, bidStrategy: BidStrategyRequest): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/campaigns/bid-strategy/${uuid}`, bidStrategy);
  }

  deleteBidStrategy(uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/campaigns/bid-strategy/${uuid}`);
  }

  getBidStrategyUuidDefault(medium: string = 'web', vendor: string | null = null): Observable<string> {
    let url = `${environment.apiUrl}/campaigns/bid-strategy/media/${medium}/uuid-default`;
    if (vendor) {
      url = `${url}?vendor=${vendor}`;
    }
    return this.http.get<BidStrategyUuidDefaultResponse>(url).pipe(map(response => response.uuid));
  }

  patchBidStrategyUuidDefault(uuid: string, medium: string = 'web', vendor: string | null = null): Observable<any> {
    let url = `${environment.serverUrl}/admin/campaigns/bid-strategy/media/${medium}/uuid-default`;
    if (vendor) {
      url = `${url}?vendor=${vendor}`;
    }
    return this.http.patch<any>(url, { uuid });
  }

  getBidStrategySpreadsheet(bidStrategyUuid: string): Observable<any> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'json',
    };

    return this.http.get<any>(`${environment.apiUrl}/campaigns/bid-strategy/${bidStrategyUuid}/spreadsheet`, options);
  }

  postBidStrategySpreadsheet(bidStrategyUuid: string, data): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/campaigns/bid-strategy/${bidStrategyUuid}/spreadsheet`, data);
  }
}
