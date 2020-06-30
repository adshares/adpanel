import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { TargetingOption } from 'models/targeting-option.model';
import { BidStrategy, BidStrategyUuidDefaultResponse, BidStrategyRequest } from 'models/campaign.model';

@Injectable()
export class BidStrategyService {

  constructor(private http: HttpClient) {
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/options/campaigns/targeting`);
  }

  getBidStrategies(): Observable<BidStrategy[]> {
    return this.http.get<BidStrategy[]>(`${environment.apiUrl}/campaigns/bid-strategy`);
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
