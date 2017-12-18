import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';


@Injectable()
export class PublisherService {

  constructor(private http: Http) {}

  getSites(): any {
    return this.http.get(`${environment.apiUrl}/sites`)
      .map((response: Response) => response.json());
  }
}
