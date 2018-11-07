import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PublisherService } from 'publisher/publisher.service';
import { Site } from 'models/site.model';

@Injectable()
export class SiteResolver implements Resolve<Site> {
  constructor(private publisherService: PublisherService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Site> {
    return this.publisherService.getSite(route.params.id);
  }
}
