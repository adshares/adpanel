import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { processTargeting } from 'common/components/targeting/targeting.helpers';
import { BidStrategy, BidStrategyRequest, BidStrategyUuidDefaultResponse } from 'models/campaign.model';
import { TargetingOption } from 'models/targeting-option.model';
import { Medium } from 'models/taxonomy-medium.model';

@Injectable()
export class BidStrategyService {

  constructor(private http: HttpClient) {
  }

  getTargetingCriteria(medium: string = 'web', vendor: string | null = null): Observable<TargetingOption[]> {
    let url = `${environment.apiUrl}/options/campaigns/media/${medium}`
    if (vendor) {
      url = `${url}?vendor=${vendor}`
    }
    return this.http.get<Medium>(url)
      .pipe(
        map(medium => processTargeting(medium))
      );
  }

  getBidStrategies(attachDefault: boolean = false): Observable<BidStrategy[]> {
    const params = {};
    if (attachDefault) {
      params['attach-default'] = 'true';
    }

    return this.http.get<BidStrategy[]>(`${environment.apiUrl}/campaigns/bid-strategy`, {params});
  }

  putBidStrategy(bidStrategy: BidStrategyRequest): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/campaigns/bid-strategy`, bidStrategy);
  }

  patchBidStrategy(uuid: string, bidStrategy: BidStrategyRequest): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/campaigns/bid-strategy/${uuid}`, bidStrategy);
  }

  deleteBidStrategy(uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/campaigns/bid-strategy/${uuid}`);
  }

  getBidStrategyUuidDefault(): Observable<BidStrategyUuidDefaultResponse> {
    return this.http.get<BidStrategyUuidDefaultResponse>(`${environment.apiUrl}/campaigns/bid-strategy/uuid-default`);
  }

  putBidStrategyUuidDefault(uuid: string): Observable<any> {
    return this.http.put<any>(`${environment.serverUrl}/admin/campaigns/bid-strategy/uuid-default`, {uuid});
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
