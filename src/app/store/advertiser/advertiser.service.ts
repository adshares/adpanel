import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';


@Injectable()
export class AdvertiserService {

  constructor(private http: Http) {}

  getCampaigns(): any {
    return this.http.get(`${environment.apiUrl}/campaigns`)
      .map((response: Response) => response.json());
  }
}
