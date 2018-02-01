import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class ChartService {

  constructor(private http: HttpClient) {}

  getDailyChartData() {
    const data = this.http.get(`${environment.apiUrl}/chart_data/daily`)
      .map((monthlyData) => {
        const values = monthlyData.values;
        const labels = monthlyData.timestamps;
        return {
          values, labels
        }
      });
    return data;
  }

  getWeeklyChartData() {
    const data = this.http.get(`${environment.apiUrl}/chart_data/weekly`)
      .map((monthlyData) => {
        const values = monthlyData.values;
        const labels = monthlyData.timestamps;
        return {
          values, labels
        }
      });
    return data;
  }

  getMonthlyChartData() {
    const data = this.http.get(`${environment.apiUrl}/chart_data/monthly`)
      .map((monthlyData) => {
        const values = monthlyData.values;
        const labels = monthlyData.timestamps;
        return {
          values, labels
        }
      });
    return data;
  }
}
