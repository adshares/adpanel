import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AdvertiserService } from 'advertiser/advertiser.service';

@Injectable()
export class TargetingCriteriaResolver implements Resolve<any> {
  constructor(private advertiserService: AdvertiserService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.advertiserService.getTargetingCriteria();
  }
}
