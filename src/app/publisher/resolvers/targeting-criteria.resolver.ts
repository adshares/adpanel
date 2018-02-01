import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PublisherService } from '../publisher.service';
import { AssetTargeting } from '../../models/targeting-option.model';

@Injectable()
export class TargetingCriteriaResolver implements Resolve<any> {
  constructor(private publisherService: PublisherService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<AssetTargeting> {
    return this.publisherService.getTargetingCriteria();
  }
}
