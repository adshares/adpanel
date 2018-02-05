import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class ChartService {

  constructor(private http: HttpClient) {}

  getChartData(span, statType) {
    return this.http.get(`${environment.apiUrl}/chart_data/${span}${statType}`)
      .map((chartData: any) => chartData);
  }
}
