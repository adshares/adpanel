import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ChartReceivedData } from 'models/chart/chart-received-data.model';
import { environment } from 'environments/environment';

@Injectable()
export class ChartService {

  constructor(private http: HttpClient) {}

  getAssetChartData(from, to, frequency, id, series): Observable<ChartReceivedData> {
    return this.http.post(`${environment.apiUrl}/chart`, { from, to, frequency, id, series })
      .map((chartData: any) => chartData);
  }

  getAssetChartDataForPublisher(from, to, frequency, id): Observable<ChartReceivedData> {
    return this.http.post(`${environment.apiUrl}/publisher_chart`, { from, to, frequency, id } )
      .map((chartData: any) => chartData);
  }
}
