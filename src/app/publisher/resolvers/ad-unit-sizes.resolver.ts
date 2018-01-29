import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { PublisherService } from '../publisher.service';
import { Observable } from 'rxjs/Observable';
import { AdUnitSize } from '../../models/site.model';

@Injectable()
export class AdUnitSizesResolver implements Resolve<AdUnitSize[]> {
  constructor(private publisherService: PublisherService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AdUnitSize[]> {
    return this.publisherService.getAdUnitSizes();
  }
}
