import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class ChartService {

  constructor(private http: HttpClient) {}

  getChartData(span) {
    const data = this.http.get(`${environment.apiUrl}/chart_data/${span}`)
      .map((chartData: any) => {
        const values = chartData.values;
        const labels = chartData.timestamps;
        return {
          values, labels
        };
      });
    return data;
  }
  //
  // getWeeklyChartData() {
  //   const data = this.http.get(`${environment.apiUrl}/chart_data/weekly`)
  //     .map((data) => {
  //       const values = data.values;
  //       const labels = data.timestamps;
  //       return {
  //         values, labels
  //       };
  //     });
  //   return data;
  // }
  //
  // getMonthlyChartData() {
  //   const data = this.http.get(`${environment.apiUrl}/chart_data/monthly`)
  //     .map((data) => {
  //       const values = data.values;
  //       const labels = data.timestamps;
  //       return {
  //         values, labels
  //       };
  //     });
  //   return data;
  // }
}
