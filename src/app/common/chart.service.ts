import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import * as qs from 'qs';

@Injectable()
export class ChartService {
  constructor(private http: HttpClient) {}

  getAssetChartData(from, to, frequency, type: string, role: string, id?: number, filter: any = {}): Observable<any> {
    const paramId = role === 'campaigns' ? 'campaign_id' : 'site_id';
    let query = { ...filter };
    if (id > 0) {
      query[paramId] = `${id}`;
    }
    const queryString = qs.stringify(query);

    return this.http
      .get(`${environment.apiUrl}/${role}/stats/chart/${type}/${frequency}/${from}/${to}?${queryString}`)
      .pipe(
        map((chartData: any) => {
          let dataObject = {
            timestamps: [],
            values: [],
            total: 0,
          };

          chartData.map(arr => {
            dataObject = {
              ...dataObject,
              timestamps: [...dataObject.timestamps, arr[0]],
              values: [...dataObject.values, arr[1]],
              total: dataObject.total + arr[1],
            };
          });
          return dataObject;
        })
      );
  }
}
