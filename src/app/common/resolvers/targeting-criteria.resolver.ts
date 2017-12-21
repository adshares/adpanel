import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { CommonService } from '../common.service';

@Injectable()
export class TargetingCriteriaResolver implements Resolve<any> {
  constructor(private commonService: CommonService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.commonService.getTargetingCriteria();
  }
}
