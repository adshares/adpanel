import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PublisherService } from '../publisher.service';

@Injectable()
export class TargetingCriteriaResolver implements Resolve<any> {
  constructor(private publisherService: PublisherService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.publisherService.getTargetingCriteria();
  }
}
