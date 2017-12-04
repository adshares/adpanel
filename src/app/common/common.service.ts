import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class CommonService {

  constructor(private http: Http) { }

  getTargetingCriteria() {
    return this.http.get(`${environment.apiUrl}/targeting-criteria`)
      .map((response: Response) => response.json());
  }
}
