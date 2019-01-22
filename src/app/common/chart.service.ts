import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {ChartReceivedData} from 'models/chart/chart-received-data.model';
import {environment} from 'environments/environment';

@Injectable()
export class ChartService {

  constructor(private http: HttpClient) {
  }

  getAssetChartData(from, to, frequency, campaignId: number, type: string): Observable<any> {
    const options = campaignId && {
      params: {
        campaign_id: `${campaignId}`
      }
    };
    return this.http.get(`${environment.apiUrl}/campaigns/stats/chart/${type}/${frequency}/${from}/${to}`, options)
      .map((chartData: any) => {
        let dataObject = {
          timestamps: [],
          values: [],
          total: 0,
        };

        chartData.map((arr) => {
          dataObject = {
            ...dataObject,
            timestamps: [...dataObject.timestamps, arr[0]],
            values: [...dataObject.values, arr[1]],
            total: dataObject.total + arr[1]
          };
        });
        return dataObject
      })
  }

  getAssetChartDataForPublisher(from, to, frequency, id): Observable<ChartReceivedData> {
    return this.http.post(`${environment.apiUrl}/publisher_chart`, {from, to, frequency, id})
      .map((chartData: any) => chartData);
  }
}
