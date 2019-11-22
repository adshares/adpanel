import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PublisherService } from 'publisher/publisher.service';
import { AdUnitMetaData } from 'models/site.model';

@Injectable()
export class AdUnitSizesResolver implements Resolve<AdUnitMetaData[]> {
  constructor(private publisherService: PublisherService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<AdUnitMetaData[]> {
    return this.publisherService.getAdUnitSizes();
  }
}
