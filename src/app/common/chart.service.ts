import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChartReceivedData } from '../models/chart/chart-received-data.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class ChartService {

  constructor(private http: HttpClient) {}

  getAssetChartData(from, to, frequency, id, series): Observable<ChartReceivedData> {
    return this.http.post(`${environment.apiUrl}/chart`, '')
      .map((chartData: any) => chartData);
  }

  getAssetChartDataForPublisher(from, to, frequency, id): Observable<ChartReceivedData> {
    return this.http.post(`${environment.apiUrl}/chart`, '')
      .map((chartData: any) => chartData);
  }
}
