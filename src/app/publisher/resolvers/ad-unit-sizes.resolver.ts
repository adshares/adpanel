import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PublisherService } from 'publisher/publisher.service';
import { AdUnitSize } from 'models/site.model';

@Injectable()
export class AdUnitSizesResolver implements Resolve<AdUnitSize[]> {
  constructor(private publisherService: PublisherService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AdUnitSize[]> {
    return this.publisherService.getAdUnitSizes();
  }
}
